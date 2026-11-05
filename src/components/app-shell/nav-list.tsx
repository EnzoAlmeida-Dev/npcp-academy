"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import { groupNavItems, type NavItem } from "@/lib/navigation";

import { NavIcon } from "./nav-icons";

function Item({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate?: () => void;
}) {
  if (item.status === "soon") {
    return (
      <span className="flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm text-muted">
        <NavIcon name={item.key} />
        <span className="flex-1">
          {item.label}
          <span className="sr-only"> (em breve)</span>
        </span>
        <span aria-hidden="true" className="text-xs">
          Em breve
        </span>
      </span>
    );
  }

  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-9 items-center gap-2.5 rounded-lg border px-2.5 text-sm transition-colors duration-150",
        active
          ? "border-border bg-surface text-ink shadow-card"
          : "border-transparent text-muted hover:bg-ink/5 hover:text-ink",
      )}
    >
      <NavIcon
        name={item.key}
        className={cn("size-4 shrink-0", active && "text-primary")}
      />
      {item.label}
    </Link>
  );
}

export function NavList({
  items,
  onNavigate,
}: {
  items: NavItem[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const groups = groupNavItems(items);

  return (
    <nav aria-label="Principal" className="flex flex-col gap-5">
      {groups.map((group) => (
        <div key={group.section}>
          {groups.length > 1 ? (
            <p className="mb-1 px-2.5 text-xs text-muted">{group.label}</p>
          ) : null}
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => (
              <li key={item.key}>
                <Item item={item} pathname={pathname} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
