import type { Role } from "@/lib/auth/roles";
import type { Database } from "@/types/database";

/** Vinculo da pessoa (D44): define o acesso as trilhas, nao as permissoes. */
export type Membership = Database["public"]["Enums"]["membership"];

export const MEMBERSHIPS: Membership[] = ["trainee", "efetivado"];

export const MEMBERSHIP_LABELS: Record<Membership, string> = {
  trainee: "Trainee",
  efetivado: "Efetivado",
};

/** Sugestao no convite: responsaveis tecnicos e gerencia sao efetivados (D44). */
export function defaultMembershipForRole(role: Role): Membership {
  return role === "member" ? "trainee" : "efetivado";
}
