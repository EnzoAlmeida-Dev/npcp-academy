import {
  BookOpen,
  ClipboardCheck,
  LayoutDashboard,
  Mail,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  paths: BookOpen,
  competencies: Target,
  reviews: ClipboardCheck,
  invitations: Mail,
  users: Users,
};

export function NavIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICONS[name] ?? LayoutDashboard;
  return <Icon aria-hidden="true" className={className ?? "size-4 shrink-0"} />;
}
