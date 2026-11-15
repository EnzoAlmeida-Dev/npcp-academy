import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { Wordmark } from "@/components/brand/wordmark";

import { ROLE_LABELS } from "@/lib/auth/roles";
import { getCurrentProfile } from "@/lib/auth/session";
import { getNavItemsForRole } from "@/lib/navigation";
import { createClient } from "@/lib/supabase/server";

import { MobileNav } from "./mobile-nav";
import { NavList } from "./nav-list";
import { UserMenu } from "./user-menu";

export default async function AppShell({
  children,
}: {
  children: ReactNode;
}) {
  const profile = await getCurrentProfile();
  if (!profile) {
    // Sessao valida sem perfil visivel = conta inativa ou desativada (RLS).
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    redirect(user ? "/login?error=inactive" : "/login");
  }
  if (!profile.display_name) {
    redirect("/welcome");
  }

  const items = getNavItemsForRole(profile.role);
  const name = profile.display_name;
  const roleLabel = ROLE_LABELS[profile.role];

  return (
    <div className="flex min-h-screen flex-col bg-canvas lg:flex-row">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-ink focus:shadow-overlay"
      >
        Pular para o conteúdo
      </a>

      <aside className="hidden w-60 shrink-0 flex-col lg:sticky lg:top-0 lg:flex lg:h-screen">
        <div className="px-5 pb-6 pt-6">
          <Wordmark tone="dark" width={148} priority />
        </div>
        <div className="flex-1 overflow-y-auto px-2.5">
          <NavList items={items} />
        </div>
        <div className="p-2.5">
          <UserMenu name={name} role={roleLabel} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:py-2 lg:pr-2">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-canvas px-4 lg:hidden">
          <Wordmark tone="dark" width={132} priority />
          <MobileNav items={items} name={name} role={roleLabel} />
        </header>
        <main
          id="conteudo"
          className="flex-1 bg-sheet px-4 py-6 sm:px-8 sm:py-8 lg:rounded-sheet lg:border lg:border-border lg:shadow-card"
        >
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
