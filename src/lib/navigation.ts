import { hasRoleAtLeast, type Role } from "@/lib/auth/roles";

export type NavSection = "learn" | "review" | "admin";

export type NavItem = {
  key: string;
  label: string;
  description: string;
  href: string;
  section: NavSection;
  requiredRole: Role;
  status: "available" | "soon";
};

export const NAV_ITEMS: NavItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    description: "Visão geral da sua conta.",
    href: "/dashboard",
    section: "learn",
    requiredRole: "member",
    status: "available",
  },
  {
    key: "paths",
    label: "Trilhas",
    description: "Trilhas de aprendizagem em sequência.",
    href: "/paths",
    section: "learn",
    requiredRole: "member",
    status: "soon",
  },
  {
    key: "competencies",
    label: "Competências",
    description: "Acompanhe suas competências.",
    href: "/competencies",
    section: "learn",
    requiredRole: "member",
    status: "soon",
  },
  {
    key: "reviews",
    label: "Revisões",
    description: "Fila de entregas para revisão.",
    href: "/reviews",
    section: "review",
    requiredRole: "reviewer",
    status: "soon",
  },
  {
    key: "invitations",
    label: "Convites",
    description: "Convide novas pessoas e defina o papel.",
    href: "/admin/invitations",
    section: "admin",
    requiredRole: "manager",
    status: "available",
  },
  {
    key: "users",
    label: "Usuários",
    description: "Contas, papéis e status.",
    href: "/admin/users",
    section: "admin",
    requiredRole: "manager",
    status: "available",
  },
];

const SECTION_LABELS: Record<NavSection, string> = {
  learn: "Aprender",
  review: "Revisar",
  admin: "Administrar",
};

export function getNavItemsForRole(role: Role): NavItem[] {
  return NAV_ITEMS.filter((item) => hasRoleAtLeast(role, item.requiredRole));
}

/** Agrupa os itens por secao, na ordem em que aparecem na navegacao. */
export function groupNavItems(
  items: NavItem[],
): { section: NavSection; label: string; items: NavItem[] }[] {
  const groups: { section: NavSection; label: string; items: NavItem[] }[] = [];
  for (const item of items) {
    const group = groups.find((g) => g.section === item.section);
    if (group) {
      group.items.push(item);
    } else {
      groups.push({
        section: item.section,
        label: SECTION_LABELS[item.section],
        items: [item],
      });
    }
  }
  return groups;
}
