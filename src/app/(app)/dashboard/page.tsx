import type { Metadata } from "next";
import Link from "next/link";

import { NavIcon } from "@/components/app-shell/nav-icons";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { ROLE_LABELS } from "@/lib/auth/roles";
import { getCurrentProfile } from "@/lib/auth/session";
import { getNavItemsForRole } from "@/lib/navigation";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile) {
    return null;
  }

  const available = getNavItemsForRole(profile.role).filter(
    (item) => item.status === "available" && item.href !== "/dashboard",
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description={`Bem-vindo${
          profile.display_name ? `, ${profile.display_name}` : ""
        }. Papel: ${ROLE_LABELS[profile.role]}.`}
      />

      <section aria-labelledby="quick-access">
        <h2
          id="quick-access"
          className="mb-3 font-heading text-lg font-semibold text-secondary"
        >
          Acesso rápido
        </h2>

        {available.length === 0 ? (
          <EmptyState
            title="As trilhas chegam em breve"
            description="Assim que a primeira trilha for publicada, você poderá começar por aqui."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {available.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="group block rounded-card"
              >
                <Card className="h-full transition-colors group-hover:border-secondary/40">
                  <NavIcon name={item.key} className="size-5 text-primary" />
                  <p className="mt-3 font-heading font-semibold text-secondary group-hover:text-primary">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm text-muted">{item.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
