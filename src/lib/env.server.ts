import "server-only";

import { z } from "zod";

/**
 * Configuracao de servidor que NAO exige privilegios elevados.
 * A service-role key fica separada em getServiceRoleKey().
 */
const appServerEnvSchema = z.object({
  INVITE_TTL_DAYS: z.coerce.number().int().positive(),
  APP_URL: z.string().url(),
});

export type AppServerEnv = z.infer<typeof appServerEnvSchema>;

/**
 * Resolve a URL publica da aplicacao. Em producao no Vercel, usa as
 * variaveis fornecidas pela plataforma caso APP_URL nao esteja definida.
 */
function resolveAppUrl(): string {
  if (process.env.APP_URL) {
    return process.env.APP_URL;
  }

  const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (productionUrl) {
    return `https://${productionUrl}`;
  }

  const deploymentUrl = process.env.VERCEL_URL;
  if (deploymentUrl) {
    return `https://${deploymentUrl}`;
  }

  return "http://localhost:3000";
}

let cachedAppServerEnv: AppServerEnv | null = null;

export function getAppServerEnv(): AppServerEnv {
  if (cachedAppServerEnv) {
    return cachedAppServerEnv;
  }

  const parsed = appServerEnvSchema.safeParse({
    INVITE_TTL_DAYS: process.env.INVITE_TTL_DAYS ?? "7",
    APP_URL: resolveAppUrl(),
  });

  if (!parsed.success) {
    throw new Error(
      "Configuracao de servidor ausente ou invalida. Confira .env.example.",
    );
  }

  cachedAppServerEnv = parsed.data;
  return cachedAppServerEnv;
}

/**
 * Service-role key: EXCLUSIVA de servidor. Usada apenas por operacoes
 * administrativas (bootstrap do primeiro gerente), nunca pelo fluxo de convites.
 */
export function getServiceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY ausente. Esta chave e exclusiva de servidor.",
    );
  }
  return key;
}
