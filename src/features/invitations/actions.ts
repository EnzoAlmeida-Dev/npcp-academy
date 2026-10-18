"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { ActionState } from "@/lib/action-state";
import { requireRole } from "@/lib/auth/authorize";
import { getAppServerEnv } from "@/lib/env.server";
import { createClient } from "@/lib/supabase/server";

import { getInvitationInfo } from "./info";
import { generateInviteToken, hashToken, normalizeEmail } from "./token";

const createInvitationSchema = z.object({
  email: z.string().email(),
  role: z.enum(["member", "reviewer", "manager"]),
});

export async function createInvitationAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const manager = await requireRole("manager");
  if (!manager) {
    return { error: "Sem permissão para criar convites." };
  }

  const parsed = createInvitationSchema.safeParse({
    email: formData.get("email"),
    role: formData.get("role"),
  });
  if (!parsed.success) {
    return { error: "Informe um e-mail válido e um papel autorizado." };
  }

  const token = generateInviteToken();
  const tokenHash = hashToken(token);
  const ttlDays = getAppServerEnv().INVITE_TTL_DAYS;
  const expiresAt = new Date(
    Date.now() + ttlDays * 24 * 60 * 60 * 1000,
  ).toISOString();

  const supabase = await createClient();
  const { error } = await supabase.from("invitations").insert({
    email_normalized: normalizeEmail(parsed.data.email),
    token_hash: tokenHash,
    role: parsed.data.role,
    expires_at: expiresAt,
    created_by: manager.id,
  });

  if (error) {
    return { error: "Não foi possível criar o convite." };
  }

  revalidatePath("/admin/invitations");

  return {
    success: true,
    inviteUrl: `${getAppServerEnv().APP_URL}/invite/${token}`,
  };
}

export async function revokeInvitationAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const manager = await requireRole("manager");
  if (!manager) {
    return { error: "Sem permissão." };
  }

  const id = formData.get("id");
  if (typeof id !== "string" || id.length === 0) {
    return { error: "Convite inválido." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("revoke_invitation", {
    p_invitation_id: id,
  });

  if (error) {
    return { error: "Não foi possível revogar o convite." };
  }

  revalidatePath("/admin/invitations");
  return { success: true };
}

const signupSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6),
  display_name: z.string().max(120).optional(),
});

export async function signUpForInviteAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = signupSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    display_name: formData.get("display_name") ?? "",
  });

  if (!parsed.success) {
    return { error: "Dados inválidos. Verifique a senha (mínimo 6 caracteres)." };
  }

  const info = await getInvitationInfo(parsed.data.token);
  if (!info || info.is_used || info.is_revoked || info.is_expired) {
    return { error: "Convite inválido ou expirado." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: info.email_normalized,
    password: parsed.data.password,
    options: {
      data: {
        display_name: parsed.data.display_name?.trim() ?? "",
        invite_token: parsed.data.token,
      },
      emailRedirectTo: `${getAppServerEnv().APP_URL}/auth/confirm`,
    },
  });

  if (error) {
    return { error: "Não foi possível criar a conta." };
  }

  return { success: true };
}
