import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { getPublicEnv } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * Cliente Supabase para Server Components e Server Actions.
 * Deve ser criado por requisicao (nunca reutilizado entre requisicoes).
 */
export async function createClient() {
  const cookieStore = await cookies();
  const env = getPublicEnv();

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      auth: { flowType: "pkce" },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Components nao podem escrever cookies; o proxy lida com isso.
          }
        },
      },
    },
  );
}
