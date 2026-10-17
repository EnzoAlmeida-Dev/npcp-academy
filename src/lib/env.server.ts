import "server-only";

import { z } from "zod";

/**
 * Variaveis exclusivas de servidor. Este modulo nunca deve ser importado
 * por codigo de cliente (o pacote `server-only` quebra o build se isso ocorrer).
 */
const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  INVITE_TTL_DAYS: z.coerce.number().int().positive(),
  APP_URL: z.string().url(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cachedServerEnv: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (cachedServerEnv) {
    return cachedServerEnv;
  }

  const parsed = serverEnvSchema.safeParse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    INVITE_TTL_DAYS: process.env.INVITE_TTL_DAYS ?? "7",
    APP_URL: process.env.APP_URL ?? "http://localhost:3000",
  });

  if (!parsed.success) {
    throw new Error(
      "Configuracao de servidor ausente ou invalida. Confira .env.example.",
    );
  }

  cachedServerEnv = parsed.data;
  return cachedServerEnv;
}
