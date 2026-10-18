// Diagnostico de conectividade dos ambientes (local x nuvem) e do alvo que
// "npm run dev" escolheria. Nao imprime valores de variaveis de ambiente.

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const files = [
  { label: ".env.local", path: resolve(root, ".env.local") },
  { label: ".env.development.local", path: resolve(root, ".env.development.local") },
];

function readEnvValue(file, key) {
  try {
    const text = readFileSync(file, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (match && match[1] === key) {
        return match[2].replace(/^["']|["']$/g, "").trim();
      }
    }
  } catch {
    // ignora
  }
  return null;
}

function classify(url) {
  if (!url) return "indefinido";
  return /^https?:\/\/(127\.0\.0\.1|localhost|\[::1\])(:\d+)?$/.test(url)
    ? "local"
    : "nuvem";
}

async function probe(url) {
  if (!url) return { reachable: false, detail: "URL ausente" };
  try {
    const res = await fetch(new URL("/auth/v1/health", url), {
      signal: AbortSignal.timeout(2000),
    });
    return {
      reachable: res.status < 500,
      detail: res.ok ? "ok" : `alcançável (HTTP ${res.status})`,
    };
  } catch {
    return { reachable: false, detail: "inacessível" };
  }
}

const results = [];
for (const file of files) {
  if (!existsSync(file.path)) {
    results.push({
      label: file.label,
      kind: "-",
      reachable: false,
      detail: "arquivo ausente",
    });
    continue;
  }
  const url = readEnvValue(file.path, "NEXT_PUBLIC_SUPABASE_URL");
  const { reachable, detail } = await probe(url);
  results.push({ label: file.label, kind: classify(url), reachable, detail });
}

for (const r of results) {
  console.log(`${r.label}: alvo=${r.kind} | health=${r.detail}`);
}

const local = results.find((r) => r.label === ".env.development.local");
const cloud = results.find((r) => r.label === ".env.local");

let choice;
if (local && local.reachable) {
  choice = "local (.env.development.local)";
} else if (cloud && cloud.kind !== "-") {
  choice = "nuvem (.env.local) — fallback";
} else {
  choice = "padrão do Next (.env)";
}

console.log(`\nnpm run dev escolheria: ${choice}`);
