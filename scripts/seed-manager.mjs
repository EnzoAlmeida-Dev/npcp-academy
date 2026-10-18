// Bootstrap do primeiro gerente.
//
// Uso:
//   npm run seed:manager -- --email=gerente@exemplo.com --confirm        (nuvem)
//   npm run seed:manager:local -- --email=gerente@exemplo.com --confirm  (local)
//
// Requisitos:
//   - SUPABASE_SERVICE_ROLE_KEY e NEXT_PUBLIC_SUPABASE_URL devem estar no ambiente.
//   - Se a conta de autenticacao ainda NAO existir, defina MANAGER_PASSWORD
//     temporariamente (ex.: no .env.local) apenas durante o bootstrap; remova depois.
//     A senha nunca e impressa.
//   - O parametro --confirm e obrigatorio (evita execucao acidental).
//   - Nao imprime segredos em nenhuma circunstancia.

import { createClient } from "@supabase/supabase-js";

function parseArgs(argv) {
  const args = { email: null, confirm: false };
  for (const arg of argv) {
    if (arg.startsWith("--email=")) {
      args.email = arg.slice("--email=".length).trim();
    } else if (arg === "--confirm") {
      args.confirm = true;
    }
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));

if (process.env.CI) {
  console.error("Refusing to run in CI.");
  process.exit(1);
}

if (!args.email || !args.confirm) {
  console.error(
    "Uso: node scripts/seed-manager.mjs --email=gerente@exemplo.com --confirm",
  );
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error(
    "Faltam NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY no ambiente.",
  );
  process.exit(1);
}

const isLocal = /^https?:\/\/(127\.0\.0\.1|localhost|\[::1\])(:\d+)?$/.test(url);
console.log(`[seed-manager] alvo: ${isLocal ? "local" : "nuvem"}`);

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const normalizedEmail = args.email.toLowerCase();

const { data: usersData, error: listError } =
  await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });

if (listError) {
  console.error("Erro ao listar usuarios:", listError.message);
  process.exit(1);
}

const matches = (usersData?.users ?? []).filter(
  (u) => (u.email ?? "").toLowerCase() === normalizedEmail,
);

let user;

if (matches.length === 0) {
  const password = process.env.MANAGER_PASSWORD;
  if (!password) {
    console.error(
      `Nenhum usuario de autenticacao encontrado para ${args.email}. ` +
        "Crie a conta no dashboard ou defina MANAGER_PASSWORD temporariamente.",
    );
    process.exit(1);
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: args.email,
    password,
    email_confirm: true,
  });

  if (error) {
    console.error("Erro ao criar usuario de autenticacao:", error.message);
    process.exit(1);
  }

  user = data.user;
  console.log(`Conta de autenticacao criada para ${args.email}.`);
} else if (matches.length > 1) {
  console.error(`Mais de um usuario encontrado para ${args.email}. Abortando.`);
  process.exit(1);
} else {
  user = matches[0];
}

const { data: existing, error: profileError } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", user.id)
  .maybeSingle();

if (profileError) {
  console.error("Erro ao consultar perfil:", profileError.message);
  process.exit(1);
}

if (existing?.role === "manager" && existing.activated_at) {
  console.log(`Usuario ${args.email} ja e gerente ativo. Nada a fazer.`);
  process.exit(0);
}

const { error: upsertError } = await supabase.from("profiles").upsert({
  id: user.id,
  display_name: existing?.display_name ?? null,
  role: "manager",
  activated_at: existing?.activated_at ?? new Date().toISOString(),
});

if (upsertError) {
  console.error("Erro ao promover gerente:", upsertError.message);
  process.exit(1);
}

console.log(`Gerente ${args.email} ativado com sucesso.`);
