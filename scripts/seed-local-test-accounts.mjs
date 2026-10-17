// Cria contas de teste LOCAIS (manager e membro) para desenvolvimento.
//
// Uso:
//   node --env-file-if-exists=.env.development.local scripts/seed-local-test-accounts.mjs
//
// Seguranca:
//   - Recusa executar contra host remoto (apenas 127.0.0.1/localhost).
//   - Usa e-mails ficticios (@npcp.test) e senha de teste conhecida.
//   - Nao imprimir segredos de servico.
//   - Nao usar em producao.

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("Faltam NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

if (!/^https?:\/\/(127\.0\.0\.1|localhost|\[::1\])(:\d+)?$/.test(url)) {
  console.error(`Recusando executar contra host nao-local: ${url}`);
  process.exit(1);
}

const PASSWORD = "npcp-teste-123";
const accounts = [
  { email: "manager@npcp.test", role: "manager", displayName: "Gerência Teste" },
  { email: "membro@npcp.test", role: "member", displayName: "Membro Teste" },
];

const admin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: usersData } = await admin.auth.admin.listUsers({
  page: 1,
  perPage: 1000,
});

for (const account of accounts) {
  const existing = (usersData?.users ?? []).filter(
    (u) => (u.email ?? "").toLowerCase() === account.email,
  );
  for (const user of existing) {
    await admin.auth.admin.deleteUser(user.id);
  }

  const { data, error } = await admin.auth.admin.createUser({
    email: account.email,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { display_name: account.displayName },
  });

  if (error) {
    console.error(`Falha ao criar ${account.email}: ${error.message}`);
    process.exit(1);
  }

  const { error: profileError } = await admin.from("profiles").upsert({
    id: data.user.id,
    display_name: account.displayName,
    role: account.role,
    activated_at: new Date().toISOString(),
  });

  if (profileError) {
    console.error(`Falha ao configurar perfil ${account.email}: ${profileError.message}`);
    process.exit(1);
  }

  console.log(`criada: ${account.email} (${account.role})`);
}

console.log(`\nSenha para ambas as contas: ${PASSWORD}`);
console.log("Apenas ambiente local.");
