import type { Metadata } from "next";

import { Avatar } from "@/components/ui/avatar";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { UserActions } from "@/features/accounts/user-actions";
import { listUsersForAdmin, type AdminUser } from "@/features/profiles/queries";
import { requireRole } from "@/lib/auth/authorize";
import { MEMBERSHIP_LABELS } from "@/lib/auth/membership";
import { ROLE_LABELS } from "@/lib/auth/roles";
import { formatDate } from "@/lib/format";

function statusOf(user: AdminUser): { label: string; tone: BadgeTone } {
  if (user.disabled_at) {
    return { label: "Desativado", tone: "danger" };
  }
  if (!user.activated_at) {
    return { label: "Aguardando ativação", tone: "warning" };
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
        description="Contas, papéis, vínculos e status. Mudanças de papel, vínculo e status ficam registradas."
      />

      {users.length === 0 ? (
        <EmptyState
          title="Nenhum usuário"
          description="Convide a primeira pessoa em Convites."
        />
      ) : (
        <Card flush>
          <ul className="divide-y divide-border">
            {users.map((user) => {
              const status = statusOf(user);
              const isSelf = user.id === manager.id;
              const name = user.display_name ?? user.email ?? "Usuário";
              return (
                <li
                  key={user.id}
                  className="flex flex-col gap-3 px-4 py-3.5 transition-colors duration-150 hover:bg-sheet lg:flex-row lg:items-center lg:justify-between lg:gap-6"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar name={name} />
                    <div className="min-w-0">
                      <p className="truncate text-sm text-ink">
                        {user.display_name ?? "Sem nome"}
                        {isSelf ? (
                          <span className="text-muted"> (você)</span>
                        ) : null}
                      </p>
                      <p className="truncate text-ui text-muted">
                        {user.email ?? "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 lg:justify-end">
                    <div className="flex flex-col items-start gap-0.5 lg:items-end">
                      <Badge tone={status.tone}>{status.label}</Badge>
                      {user.activated_at ? (
                        <span className="text-xs text-muted">
                          Desde {formatDate(user.activated_at)}
                        </span>
                      ) : null}
                    </div>
                    {isSelf || !user.activated_at ? (
                      <span className="text-ui text-muted">
                        {ROLE_LABELS[user.role]}, {MEMBERSHIP_LABELS[user.membership].toLowerCase()}
                      </span>
                    ) : (
                      <UserActions
                        userId={user.id}
                        name={name}
                        role={user.role}
                        membership={user.membership}
                        disabled={user.disabled_at !== null}
                      />
                    )}
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
