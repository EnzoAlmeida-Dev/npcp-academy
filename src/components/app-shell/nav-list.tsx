"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import type { NavItem } from "@/lib/navigation";

import { NavIcon } from "./nav-icons";

export function NavList({
  items,
  onNavigate,
}: {
  items: NavItem[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Principal">
      <ul className="flex flex-col gap-1">
        {items.map((item) => {
          if (item.status === "soon") {
            return (
              <li key={item.key}>
                <span className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70">
                  <NavIcon name={item.key} />
                  <span className="flex-1">
                    {item.label}
                    <span className="sr-only"> (em breve)</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="rounded-full bg-white/10 px-2 py-0.5 text-xs"
                  >
                    Em breve
                  </span>
                </span>
              </li>
            );
          }

          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.key}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white",
                )}
              >
                <NavIcon name={item.key} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
