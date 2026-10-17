import { z } from "zod";

/**
 * Variaveis publicas do Supabase. Podem ser usadas no cliente e no servidor.
 * A validacao e feita sob demanda para nao quebrar o build sem variaveis.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

let cachedPublicEnv: PublicEnv | null = null;

export function getPublicEnv(): PublicEnv {
  if (cachedPublicEnv) {
    return cachedPublicEnv;
  }

  const parsed = publicEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });

  if (!parsed.success) {
    throw new Error(
      "Configuracao publica do Supabase ausente ou invalida. Confira .env.example.",
    );
  }

  cachedPublicEnv = parsed.data;
  return cachedPublicEnv;
}
