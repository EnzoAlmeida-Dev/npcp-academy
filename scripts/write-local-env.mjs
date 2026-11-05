// Gera .env.development.local a partir de `supabase status -o env` (stdin).
//
// Uso:
//   npx supabase status -o env | node scripts/write-local-env.mjs
//
// Seguranca: recusa URL que nao seja local e nunca imprime chaves.

import { readFileSync, writeFileSync } from "node:fs";

const input = readFileSync(0, "utf8");
const vars = {};
for (const line of input.split(/\r?\n/)) {
  const match = line.match(/^([A-Z_]+)="?(.*?)"?$/);
  if (match) vars[match[1]] = match[2];
}

const url = vars.API_URL;
const publishableKey = vars.PUBLISHABLE_KEY || vars.ANON_KEY;
const serviceRoleKey = vars.SERVICE_ROLE_KEY;

if (!url || !publishableKey || !serviceRoleKey) {
  console.error("Saida do `supabase status` incompleta. O Supabase local esta rodando?");
  process.exit(1);
}
if (!/^https?:\/\/(127\.0\.0\.1|localhost|\[::1\])(:\d+)?$/.test(url)) {
  console.error(`Recusando gravar URL nao-local: ${url}`);
  process.exit(1);
}

writeFileSync(
  ".env.development.local",
  [
    `NEXT_PUBLIC_SUPABASE_URL=${url}`,
    `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${publishableKey}`,
    `SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}`,
    "INVITE_TTL_DAYS=7",
    "APP_URL=http://127.0.0.1:3000",
    "",
  ].join("\n"),
  "utf8",
);
console.log(`.env.development.local gravado (Supabase local em ${url}).`);
