import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type InvitationRow = Database["public"]["Tables"]["invitations"]["Row"];

export async function listInvitations(): Promise<InvitationRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("invitations")
    .select("*")
    .order("created_at", { ascending: false });

  return data ?? [];
}
