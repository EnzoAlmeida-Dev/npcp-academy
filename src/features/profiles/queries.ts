import "server-only";

import type { Membership } from "@/lib/auth/membership";
import type { Role } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";

export type AdminUser = {
  id: string;
  email: string | null;
  display_name: string | null;
  role: Role;
  membership: Membership;
  activated_at: string | null;
  disabled_at: string | null;
};

export async function listUsersForAdmin(): Promise<AdminUser[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("list_users_for_admin");

  if (error) {
    console.error("[admin] list_users_for_admin:", error.message);
    return [];
  }

  return (data ?? []).map((u) => ({
    id: u.id,
    email: u.email,
    display_name: u.display_name,
    role: u.role,
    membership: u.membership,
    activated_at: u.activated_at,
    disabled_at: u.disabled_at,
  }));
}
