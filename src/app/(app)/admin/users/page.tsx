import type { Metadata } from "next";

import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { listUsersForAdmin, type AdminUser } from "@/features/profiles/queries";
import { requireRole } from "@/lib/auth/authorize";
import { ROLE_LABELS } from "@/lib/auth/roles";
import { formatDate } from "@/lib/format";

function statusOf(user: AdminUser): { label: string; tone: BadgeTone } {
  if (user.disabled_at) {
    return { label: "Desativado", tone: "danger" };
  }
  if (!user.activated_at) {
    return { label: "Inativo", tone: "warning" };
  }
  return { label: "Ativo", tone: "success" };
}

export const metadata: Metadata = { title: "Usuários" };

export default async function AdminUsersPage() {
  const manager = await requireRole("manager");
  if (!manager) {
    return (
      <p role="alert" className="text-sm text-danger">
        Sem permissão para acessar esta página.
      </p>
    );
  }

  const users = await listUsersForAdmin();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Usuários"
        description="Contas cadastradas na plataforma."
      />

      {users.length === 0 ? (
        <EmptyState
          title="Nenhum usuário"
          description="Nenhuma conta encontrada ainda."
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <ul className="divide-y divide-border">
            {users.map((user) => {
              const status = statusOf(user);
              return (
                <li
                  key={user.id}
                  className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">
                      {user.display_name ?? "Sem nome"}
                    </p>
                    <p className="truncate text-sm text-muted">
                      {user.email ?? "—"}
                      {user.activated_at
                        ? ` · ativo desde ${formatDate(user.activated_at)}`
                        : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge tone="info">{ROLE_LABELS[user.role]}</Badge>
                    <Badge tone={status.tone}>{status.label}</Badge>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}
