import type { Role } from "@/lib/auth/roles";

export type UserSummary = {
  active: number;
  pendingActivation: number;
  disabled: number;
  activeByRole: Record<Role, number>;
};

/** Papeis contam apenas contas ativas. */
export function summarizeUsers(
  users: {
    role: Role;
    activated_at: string | null;
    disabled_at: string | null;
  }[],
): UserSummary {
  const summary: UserSummary = {
    active: 0,
    pendingActivation: 0,
    disabled: 0,
    activeByRole: { member: 0, reviewer: 0, manager: 0 },
  };

  for (const user of users) {
    if (user.disabled_at) {
      summary.disabled += 1;
    } else if (!user.activated_at) {
      summary.pendingActivation += 1;
    } else {
      summary.active += 1;
      summary.activeByRole[user.role] += 1;
    }
  }
  return summary;
}

/** Convites que ainda podem ser aceitos: nao usados, revogados nem expirados. */
export function countOpenInvitations(
  invitations: {
    used_at: string | null;
    revoked_at: string | null;
    expires_at: string;
  }[],
  now: number = Date.now(),
): number {
  return invitations.filter(
    (inv) =>
      !inv.used_at &&
      !inv.revoked_at &&
      new Date(inv.expires_at).getTime() > now,
  ).length;
}
