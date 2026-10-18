// Launcher de desenvolvimento com selecao automatica de ambiente.
//
// - Se o Supabase LOCAL (Docker) estiver acessivel, usa .env.development.local.
// - Caso contrario, se existir .env.local, injeta a nuvem no processo do Next
//   (fallback), de modo que "esquecer o Docker" nao quebre o desenvolvimento.
//
// Nao usa --env-file (o Next repassa execArgv aos workers e o Node o rejeita
// via NODE_OPTIONS). Nao imprime valores de variaveis de ambiente.

import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const nextBin = resolve(root, "node_modules/next/dist/bin/next");
const localEnv = resolve(root, ".env.development.local");
const cloudEnv = resolve(root, ".env.local");

function parseEnvFile(file) {
  const result = {};
  if (!existsSync(file)) return result;
  const text = readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^(?:export\s+)?([\w.-]+)\s*=\s*(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    result[match[1]] = value;
  }
  return result;
}

function classify(url) {
  if (!url) return "indefinido";
  return /^https?:\/\/(127\.0\.0\.1|localhost|\[::1\])(:\d+)?$/.test(url)
    ? "local"
    : "nuvem";
}

async function reachable(url, ms = 1500) {
  if (!url) return false;
  try {
    const res = await fetch(new URL("/auth/v1/health", url), {
      signal: AbortSignal.timeout(ms),
    });
    // Qualquer resposta (inclusive 401) indica que o servidor esta no ar.
    return res.status < 500;
  } catch {
    return false;
  }
}

const localVars = parseEnvFile(localEnv);
const localUrl = localVars.NEXT_PUBLIC_SUPABASE_URL ?? null;
const localUp = await reachable(localUrl);

const forwardArgs = process.argv.slice(2);
let args;
let target;
let childEnv = process.env;

if (localUp) {
  target = `local (${classify(localUrl)}) — Supabase Docker`;
  args = [nextBin, "dev", ...forwardArgs];
} else if (existsSync(cloudEnv)) {
  target = "nuvem — .env.local (fallback: local indisponível)";
  // Injeta a nuvem no ambiente do processo. Como esses valores já existem em
  // process.env, o Next não os sobrescreve com .env.development.local.
  childEnv = { ...parseEnvFile(cloudEnv), ...process.env };
  args = [nextBin, "dev", ...forwardArgs];
} else if (existsSync(localEnv)) {
  target = "local — sem .env.local para fallback (Docker pode estar parado)";
  args = [nextBin, "dev", ...forwardArgs];
} else {
  target = "padrão do Next (.env)";
  args = [nextBin, "dev", ...forwardArgs];
}

console.log(`[dev] alvo: ${target}`);
console.log("[dev] conectividade: npm run check:supabase");

const child = spawn(process.execPath, args, {
  stdio: "inherit",
  env: childEnv,
});
child.on("exit", (code) => process.exit(code ?? 0));
process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));
