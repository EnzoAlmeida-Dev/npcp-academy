import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { logoutAction } from "@/features/auth/actions";
import { ROLE_LABELS } from "@/lib/auth/roles";
import { getCurrentProfile } from "@/lib/auth/session";
import { getNavItemsForRole } from "@/lib/navigation";

import { MobileNav } from "./mobile-nav";
import { NavList } from "./nav-list";

function Brand() {
  return (
    <div className="px-6 py-5">
      <span className="font-heading text-lg font-bold text-white">
        NPCP Academy
      </span>
    </div>
  );
}

export default async function AppShell({
  children,
}: {
  children: ReactNode;
}) {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/login");
  }

  const items = getNavItemsForRole(profile.role);
  const name = profile.display_name ?? "Usuário";
  const roleLabel = ROLE_LABELS[profile.role];

  return (
    <div className="min-h-screen lg:flex">
      <aside className="hidden w-64 flex-col bg-secondary lg:flex">
        <Brand />
        <div className="flex-1 px-3">
          <NavList items={items} />
        </div>
        <div className="border-t border-white/10 px-6 py-4">
          <p className="text-sm font-medium text-white">{name}</p>
          <p className="text-xs text-white/60">{roleLabel}</p>
          <form action={logoutAction}>
            <button
              type="submit"
              className="mt-2 text-sm text-white/70 underline hover:text-white"
            >
              Sair
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="relative flex items-center justify-between bg-secondary px-4 py-3 lg:hidden">
          <span className="font-heading text-lg font-bold text-white">
            NPCP Academy
          </span>
          <MobileNav items={items} name={name} role={roleLabel} />
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
