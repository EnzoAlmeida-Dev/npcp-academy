import { randomUUID } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Role } from "@/lib/auth/roles";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

const LOCAL_URL = /^https?:\/\/(127\.0\.0\.1|localhost|\[::1\])(:\d+)?$/;
const PASSWORD = "senha-integracao-123";

/**
 * Le apenas .env.development.local (nunca .env.local, que aponta para a nuvem)
 * e recusa qualquer host que nao seja local.
 */
function loadLocalEnv() {
  const file = resolve(process.cwd(), ".env.development.local");
  const vars: Record<string, string> = {};
  if (existsSync(file)) {
    const text = readFileSync(file, "utf8").replace(/^﻿/, "");
    for (const line of text.split(/\r?\n/)) {
      const match = line.trim().match(/^([\w.-]+)\s*=\s*(.*)$/);
      if (match) {
        vars[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
      }
    }
  }

  const url = vars.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = vars.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const serviceRoleKey = vars.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !publishableKey || !serviceRoleKey) {
    throw new Error(
      "Testes de integracao exigem .env.development.local com o Supabase local (npx supabase start).",
    );
  }
  if (!LOCAL_URL.test(url)) {
    throw new Error(`Recusando executar contra host nao-local: ${url}`);
  }
  return { url, publishableKey, serviceRoleKey };
}

const env = loadLocalEnv();
const noSession = { autoRefreshToken: false, persistSession: false };

export const admin: Client = createClient<Database>(
  env.url,
  env.serviceRoleKey,
  { auth: noSession },
);

const createdUserIds: string[] = [];

export type TestUser = { id: string; email: string; client: Client };

/**
 * Cria um usuario com e-mail confirmado. Por padrao, ja ativo com o papel
 * indicado; com `activate: false`, fica com perfil inativo (pre-convite).
 */
export async function createUser(
  role: Role = "member",
  options: { activate?: boolean; displayName?: string | null; email?: string } = {},
): Promise<TestUser> {
  const email = options.email ?? `it-${randomUUID()}@npcp.test`;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
  });
  if (error || !data.user) {
    throw new Error(`createUser: ${error?.message}`);
  }
  createdUserIds.push(data.user.id);

  if (options.activate !== false) {
    const { error: profileError } = await admin
      .from("profiles")
      .update({
        role,
        activated_at: new Date().toISOString(),
        display_name:
          options.displayName === undefined ? "Pessoa Teste" : options.displayName,
      })
      .eq("id", data.user.id);
    if (profileError) {
      throw new Error(`perfil: ${profileError.message}`);
    }
  }

  return { id: data.user.id, email, client: await signIn(email) };
}

export async function signIn(email: string): Promise<Client> {
  const client = createClient<Database>(env.url, env.publishableKey, {
    auth: noSession,
  });
  const { error } = await client.auth.signInWithPassword({
    email,
    password: PASSWORD,
  });
  if (error) {
    throw new Error(`signIn ${email}: ${error.message}`);
  }
  return client;
}

export async function deleteCreatedUsers() {
  while (createdUserIds.length > 0) {
    const id = createdUserIds.pop()!;
    await admin.auth.admin.deleteUser(id).catch(() => {});
  }
}

export async function profileOf(id: string) {
  const { data } = await admin
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}
