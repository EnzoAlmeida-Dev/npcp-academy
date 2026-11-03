import type { ReactNode } from "react";
import { LogOut } from "lucide-react";
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
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-secondary"
      >
        Pular para o conteúdo
      </a>

      <aside className="on-dark hidden w-64 shrink-0 flex-col bg-secondary lg:sticky lg:top-0 lg:flex lg:h-screen">
        <Brand />
        <div className="flex-1 overflow-y-auto px-3">
          <NavList items={items} />
        </div>
        <div className="border-t border-white/10 px-6 py-4">
          <p className="text-sm font-medium text-white">{name}</p>
          <p className="text-xs text-white/70">{roleLabel}</p>
          <form action={logoutAction}>
            <button
              type="submit"
              className="mt-2 inline-flex items-center gap-2 py-1 text-sm text-white/80 underline hover:text-white"
            >
              <LogOut aria-hidden="true" className="size-4" />
              Sair
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="on-dark relative flex items-center justify-between bg-secondary px-4 py-3 lg:hidden">
          <span className="font-heading text-lg font-bold text-white">
            NPCP Academy
          </span>
          <MobileNav items={items} name={name} role={roleLabel} />
        </header>
        <main id="conteudo" className="flex-1 p-4 sm:p-6">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
