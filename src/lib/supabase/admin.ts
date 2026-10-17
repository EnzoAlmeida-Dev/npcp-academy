import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { getPublicEnv } from "@/lib/env";
import { getServerEnv } from "@/lib/env.server";
import type { Database } from "@/types/database";

/**
 * Cliente administrativo com a service-role key.
 * EXCLUSIVO de servidor: nunca importar em codigo de cliente.
 * Usar somente para operacoes que exigem privilegio elevado
 * (ex.: bootstrap do primeiro gerente). Nunca expor no cliente.
 */
export function createAdminClient() {
  const pub = getPublicEnv();
  const server = getServerEnv();

  return createSupabaseClient<Database>(
    pub.NEXT_PUBLIC_SUPABASE_URL,
    server.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
