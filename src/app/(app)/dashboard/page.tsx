import Link from "next/link";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { ROLE_LABELS } from "@/lib/auth/roles";
import { getCurrentProfile } from "@/lib/auth/session";
import { getNavItemsForRole } from "@/lib/navigation";

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

      <section>
        <h2 className="mb-3 font-heading text-lg font-semibold text-secondary">
          Acesso rápido
        </h2>

        {available.length === 0 ? (
          <EmptyState
            title="Nada por aqui ainda"
            description="Novas áreas serão adicionadas em breve."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {available.map((item) => (
              <Card key={item.key}>
                <Link
                  href={item.href}
                  className="font-heading font-semibold text-secondary hover:text-primary"
                >
                  {item.label}
                </Link>
                <p className="mt-1 text-sm text-muted">
                  Acessar {item.label.toLowerCase()}.
                </p>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
