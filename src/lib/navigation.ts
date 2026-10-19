import { hasRoleAtLeast, type Role } from "@/lib/auth/roles";

export type NavItem = {
  key: string;
  label: string;
  href: string;
  requiredRole: Role;
  status: "available" | "soon";
};

export const NAV_ITEMS: NavItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    requiredRole: "member",
    status: "available",
  },
  {
    key: "paths",
    label: "Trilhas",
    href: "/paths",
    requiredRole: "member",
    status: "soon",
  },
  {
    key: "competencies",
    label: "Competências",
    href: "/competencies",
    requiredRole: "member",
    status: "soon",
  },
  {
    key: "reviews",
    label: "Revisões",
    href: "/reviews",
    requiredRole: "reviewer",
    status: "soon",
  },
  {
    key: "invitations",
    label: "Convites",
    href: "/admin/invitations",
    requiredRole: "manager",
    status: "available",
  },
  {
    key: "users",
    label: "Usuários",
    href: "/admin/users",
    requiredRole: "manager",
    status: "available",
  },
];

export function getNavItemsForRole(role: Role): NavItem[] {
  return NAV_ITEMS.filter((item) => hasRoleAtLeast(role, item.requiredRole));
}
