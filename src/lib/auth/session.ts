import "server-only";

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

/**
 * Perfil do usuario autenticado, ou null se nao houver sessao
 * ou se o perfil nao estiver visivel (inativo/desativado/RLS).
 */
export const getCurrentProfile = cache(async (): Promise<ProfileRow | null> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data ?? null;
});
