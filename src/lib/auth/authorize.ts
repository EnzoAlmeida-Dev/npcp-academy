import "server-only";

import { hasRoleAtLeast, type Role } from "@/lib/auth/roles";
import { getCurrentProfile, type ProfileRow } from "@/lib/auth/session";

/**
 * Retorna o perfil do usuario autenticado somente se ele estiver ativo
 * e possuir o papel minimo exigido. Caso contrario, retorna null.
 */
export async function requireRole(required: Role): Promise<ProfileRow | null> {
  const profile = await getCurrentProfile();

  if (!profile) {
    return null;
  }
  if (profile.activated_at === null || profile.disabled_at !== null) {
    return null;
  }
  if (!hasRoleAtLeast(profile.role, required)) {
    return null;
  }

  return profile;
}

export async function isManager(): Promise<boolean> {
  return (await requireRole("manager")) !== null;
}
