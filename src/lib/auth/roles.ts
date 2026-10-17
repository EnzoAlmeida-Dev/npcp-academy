import type { Database } from "@/types/database";

export type Role = Database["public"]["Enums"]["user_role"];

export const ROLE_RANK: Record<Role, number> = {
  member: 1,
  reviewer: 2,
  manager: 3,
};

export const ROLE_LABELS: Record<Role, string> = {
  member: "Membro",
  reviewer: "Responsável técnico",
  manager: "Gerência",
};

export function hasRoleAtLeast(role: Role, required: Role): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[required];
}
