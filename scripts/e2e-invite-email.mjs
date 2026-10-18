// E2E do convite com confirmacao de e-mail REAL via Mailpit (local).
//
// Uso:
//   node --env-file-if-exists=.env.development.local scripts/e2e-invite-email.mjs
//
// Fluxo: cria convite -> signUp -> aguarda e-mail no Mailpit -> extrai o token
// de confirmacao -> verifyOtp -> consome o convite -> valida ativacao.
// Recusa executar contra host remoto.

import { createHash, randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const mailpit = process.env.MAILPIT_URL ?? "http://127.0.0.1:55425";

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

function memoryStorage() {
  const store = new Map();
  return {
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => void store.set(k, String(v)),
    removeItem: (k) => void store.delete(k),
  };
}

const email = `e2e-email-${randomUUID()}@example.test`;
const password = "senha-teste-123";
const inviteToken = `tok-email-${randomUUID()}`;
const results = [];
const ok = (name, detail = "") => {
  results.push(true);
  console.log(`PASS  ${name}${detail ? " — " + detail : ""}`);
};
const fail = (name, detail = "") => {
  results.push(false);
  console.log(`FAIL  ${name}${detail ? " — " + detail : ""}`);
};

let userId = null;

try {
  // 1. Convite
  const { error: invErr } = await admin.from("invitations").insert({
    email_normalized: email,
    token_hash: hash(inviteToken),
    role: "member",
    expires_at: new Date(Date.now() + 7 * 864e5).toISOString(),
  });
  if (invErr) throw new Error(`insert invitation: ${invErr.message}`);
  ok("convite criado");

  // 2. signUp (pkce) -> deve exigir confirmacao
  const anon = createClient(url, publishableKey, {
    auth: {
      storage: memoryStorage(),
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
      flowType: "pkce",
    },
  });
  const { data: signUpData, error: signUpErr } = await anon.auth.signUp({
    email,
    password,
    options: {
      data: { invite_token: inviteToken },
      emailRedirectTo: "http://127.0.0.1:3000/auth/confirm",
    },
  });
  if (signUpErr) throw new Error(`signUp: ${signUpErr.message}`);
  userId = signUpData.user?.id ?? null;
  ok("signUp aceito");
  if (signUpData.session) {
    fail("confirmacao exigida", "signUp retornou sessao (confirmacao desabilitada)");
  } else {
    ok("confirmacao de e-mail exigida", "sem sessao no signUp");
  }

  // 3. Localiza e-mail no Mailpit
  let messageId = null;
  for (let i = 0; i < 30 && !messageId; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    const res = await fetch(`${mailpit}/api/v1/messages?limit=50`);
    const body = await res.json();
    const msg = (body.messages ?? []).find((m) =>
      (m.To ?? []).some(
        (t) => (t.Address ?? "").toLowerCase() === email.toLowerCase(),
      ),
    );
    messageId = msg?.ID ?? null;
  }
  if (!messageId) throw new Error("e-mail de confirmacao nao chegou no Mailpit");
  ok("e-mail de confirmacao recebido");

  const msgRes = await fetch(`${mailpit}/api/v1/message/${messageId}`);
  const msg = await msgRes.json();
  const raw = `${msg.HTML ?? ""}\n${msg.Text ?? ""}`.replaceAll("&amp;", "&");

  const tokenHashMatch = raw.match(/token_hash=([^&"'\s<?]+)/);
  const tokenMatch = raw.match(/[?&]token=([^&"'\s<?]+)/);
  const typeMatch = raw.match(/[?&]type=([^&"'\s<?]+)/);
  const type = (typeMatch?.[1] ?? "signup").trim();

  const maskedUrl = (raw.match(/https?:\/\/[^\s"'<>]+/) ?? ["(sem url)"])[0]
    .replace(/((?:token|token_hash)=)[^&"'\s<?]+/g, "$1***");
  console.log(`  link: ${maskedUrl}`);

  if (tokenHashMatch) {
    ok("link usa token_hash (PKCE)", `type=${type}`);
  } else if (tokenMatch) {
    ok("link usa token (implicit)", `type=${type}`);
  } else {
    fail("token de confirmacao encontrado no e-mail");
  }

  // 4. Confirma. O endpoint /verify do GoTrue aceita o token hasheado como
  // token_hash; tentamos essa forma primeiro e, em seguida, token+email.
  let verifyErr = null;
  const tokenValue = tokenHashMatch?.[1] ?? tokenMatch?.[1];
  if (!tokenValue) {
    verifyErr = new Error("sem token");
  } else if (tokenHashMatch) {
    const { error } = await anon.auth.verifyOtp({
      token_hash: tokenHashMatch[1],
      type,
    });
    verifyErr = error;
  } else {
    const { error: hashErr } = await anon.auth.verifyOtp({
      token_hash: tokenValue,
      type,
    });
    if (!hashErr) {
      verifyErr = null;
    } else {
      const { error: rawErr } = await anon.auth.verifyOtp({
        email,
        token: tokenValue,
        type,
      });
      verifyErr = rawErr ?? hashErr;
    }
  }
  if (verifyErr) {
    fail("confirmacao do e-mail", verifyErr.message);
  } else {
    ok("confirmacao do e-mail");
  }

  // 5. Sessao apos confirmar
  const { data: sessionData } = await anon.auth.getSession();
  const accessToken = sessionData.session?.access_token;
  if (!accessToken) {
    fail("sessao apos confirmacao");
    throw new Error("sem sessao apos confirmar");
  }
  ok("sessao estabelecida apos confirmacao");

  const asUser = createClient(url, publishableKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });

  // 6. Consome o convite
  const { error: consumeErr } = await asUser.rpc("consume_invitation", {
    p_token_hash: hash(inviteToken),
    p_user_id: userId,
  });
  if (consumeErr) {
    fail("consume_invitation apos confirmar", consumeErr.message);
  } else {
    ok("consume_invitation apos confirmar");
  }

  const { data: profile } = await asUser
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (profile?.activated_at && profile?.role === "member") {
    ok("perfil ativado com papel member");
  } else {
    fail("perfil ativado com papel member");
  }
} catch (err) {
  fail("execucao", err.message);
} finally {
  try {
    await admin
      .from("invitations")
      .delete()
      .like("email_normalized", "e2e-email-%@example.test");
  } catch {
    // best effort
  }
  if (userId) {
    await admin.auth.admin.deleteUser(userId).catch(() => {});
  }
  const passed = results.filter(Boolean).length;
  console.log(`\nResumo: ${passed}/${results.length} ok`);
  if (passed !== results.length) process.exitCode = 1;
}
