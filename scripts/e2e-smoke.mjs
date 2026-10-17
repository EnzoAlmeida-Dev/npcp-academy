// Smoke E2E do fluxo de convites contra o Supabase LOCAL.
//
// Uso:
//   node --env-file-if-exists=.env.development.local scripts/e2e-smoke.mjs
//
// Recusa executar contra qualquer host que nao seja local (seguranca).
// Cria usuarios de teste com e-mails *.example.test e os remove ao final.

import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !publishableKey || !serviceRoleKey) {
  console.error("Faltam variaveis de ambiente.");
  process.exit(1);
}

if (!/^https?:\/\/(127\.0\.0\.1|localhost|\[::1\])(:\d+)?$/.test(url)) {
  console.error(`Recusando executar contra host remoto: ${url}`);
  process.exit(1);
}

const hash = (s) => createHash("sha256").update(s).digest("hex");

const admin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function asUser(accessToken) {
  return createClient(url, publishableKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

async function createConfirmedUser(email) {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: "senha-teste-123",
    email_confirm: true,
  });
  if (error) throw new Error(`createUser ${email}: ${error.message}`);
  return data.user;
}

const created = [];
const results = [];
function record(name, ok, detail = "") {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`);
}

async function signIn(email) {
  const anon = createClient(url, publishableKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await anon.auth.signInWithPassword({
    email,
    password: "senha-teste-123",
  });
  if (error) throw new Error(`signIn ${email}: ${error.message}`);
  return data.session.access_token;
}

async function cleanup(userIds) {
  for (const id of userIds) {
    await admin.auth.admin.deleteUser(id).catch(() => {});
  }
}

try {
  // 1. Manager
  const manager = await createConfirmedUser("e2e-manager@example.test");
  created.push(manager.id);
  await admin.from("profiles").upsert({
    id: manager.id,
    role: "manager",
    activated_at: new Date().toISOString(),
    display_name: "E2E Manager",
  });

  // 2. Member + invitation criada pelo manager (via sessao autenticada)
  const member = await createConfirmedUser("e2e-member@example.test");
  created.push(member.id);

  const managerToken = await signIn("e2e-manager@example.test");
  const managerClient = asUser(managerToken);
  const inviteToken = "tok-e2e-valid";
  const { error: insertErr } = await managerClient.from("invitations").insert({
    email_normalized: "e2e-member@example.test",
    token_hash: hash(inviteToken),
    role: "member",
    expires_at: new Date(Date.now() + 7 * 864e5).toISOString(),
    created_by: manager.id,
  });
  record("manager cria convite (RLS)", !insertErr, insertErr?.message ?? "");

  // 3. Consumo valido
  const memberToken = await signIn("e2e-member@example.test");
  const memberClient = asUser(memberToken);
  const { error: consumeErr } = await memberClient.rpc("consume_invitation", {
    p_token_hash: hash(inviteToken),
    p_user_id: member.id,
  });
  record("member consome convite valido", !consumeErr, consumeErr?.message ?? "");
  const { data: profileAfter } = await memberClient
    .from("profiles")
    .select("*")
    .eq("id", member.id)
    .single();
  record(
    "perfil ativado com papel member",
    profileAfter?.role === "member" && !!profileAfter?.activated_at,
  );

  // 4. Token ja usado por outro usuario -> falha
  const other = await createConfirmedUser("e2e-other@example.test");
  created.push(other.id);
  const otherToken = await signIn("e2e-other@example.test");
  const otherClient = asUser(otherToken);
  const { error: reuseErr } = await otherClient.rpc("consume_invitation", {
    p_token_hash: hash(inviteToken),
    p_user_id: other.id,
  });
  record("token ja usado rejeitado", !!reuseErr);

  // 5. RLS: member nao lista convites
  const { data: listData } = await memberClient.from("invitations").select("*");
  record(
    "RLS: member nao lista convites",
    Array.isArray(listData) && listData.length === 0,
  );

  // 6. Concorrencia: dois usuarios novos, mesmo token
  const [u1, u2] = await Promise.all([
    createConfirmedUser("e2e-race1@example.test"),
    createConfirmedUser("e2e-race2@example.test"),
  ]);
  created.push(u1.id, u2.id);
  const raceToken = "tok-e2e-race";
  await managerClient.from("invitations").insert({
    email_normalized: "e2e-race@example.test",
    token_hash: hash(raceToken),
    role: "member",
    expires_at: new Date(Date.now() + 7 * 864e5).toISOString(),
    created_by: manager.id,
  });
  const [t1, t2] = await Promise.all([
    signIn("e2e-race1@example.test"),
    signIn("e2e-race2@example.test"),
  ]);
  // Nenhum dos dois tem o e-mail "e2e-race@example.test"; forca e-mail divergente
  // para testar a rejeicao de concorrencia por e-mail (ambos devem falhar).
  const [r1, r2] = await Promise.all([
    asUser(t1).rpc("consume_invitation", {
      p_token_hash: hash(raceToken),
      p_user_id: u1.id,
    }),
    asUser(t2).rpc("consume_invitation", {
      p_token_hash: hash(raceToken),
      p_user_id: u2.id,
    }),
  ]);
  record(
    "concorrencia: e-mail divergente rejeitado para ambos",
    !!r1.error && !!r2.error,
  );

  const failed = results.filter((r) => !r.ok);
  console.log(
    `\nResumo: ${results.length - failed.length}/${results.length} ok`,
  );
  if (failed.length) process.exitCode = 1;
} finally {
  await cleanup(created);
}
