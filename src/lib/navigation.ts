import { hasRoleAtLeast, type Role } from "@/lib/auth/roles";

export type NavItem = {
  key: string;
  label: string;
  description: string;
  href: string;
  requiredRole: Role;
  status: "available" | "soon";
};

export const NAV_ITEMS: NavItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    description: "Visão geral da sua conta.",
    href: "/dashboard",
    requiredRole: "member",
    status: "available",
  },
  {
    key: "paths",
    label: "Trilhas",
    description: "Trilhas de aprendizagem em sequência.",
    href: "/paths",
    requiredRole: "member",
    status: "soon",
  },
  {
    key: "competencies",
    label: "Competências",
    description: "Acompanhe suas competências.",
    href: "/competencies",
    requiredRole: "member",
    status: "soon",
  },
  {
    key: "reviews",
    label: "Revisões",
    description: "Fila de entregas para revisão.",
    href: "/reviews",
    requiredRole: "reviewer",
    status: "soon",
  },
  {
    key: "invitations",
    label: "Convites",
    description: "Convide novas pessoas e defina o papel.",
    href: "/admin/invitations",
    requiredRole: "manager",
    status: "available",
  },
  {
    key: "users",
    label: "Usuários",
    description: "Contas, papéis e status.",
    href: "/admin/users",
    requiredRole: "manager",
    status: "available",
  },
];

export function getNavItemsForRole(role: Role): NavItem[] {
  return NAV_ITEMS.filter((item) => hasRoleAtLeast(role, item.requiredRole));
}
