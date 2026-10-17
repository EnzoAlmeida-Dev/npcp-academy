import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { logoutAction } from "@/features/auth/actions";
import { getCurrentProfile } from "@/lib/auth/session";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b px-6 py-3">
        <span className="font-semibold">NPCP Academy</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-600">
            {profile.display_name ?? "Usuário"}
          </span>
          <form action={logoutAction}>
            <button type="submit" className="text-sm underline">
              Sair
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
