import type { Metadata } from "next";

import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { CreateInvitationForm } from "@/features/invitations/create-invitation-form";
import { listInvitations } from "@/features/invitations/queries";
import { RevokeInvitationButton } from "@/features/invitations/revoke-invitation-button";
import { requireRole } from "@/lib/auth/authorize";
import { ROLE_LABELS } from "@/lib/auth/roles";
import { formatDate } from "@/lib/format";

function invitationStatus(inv: {
  used_at: string | null;
  revoked_at: string | null;
  expires_at: string;
}): { label: string; tone: BadgeTone } {
  if (inv.used_at) {
    return { label: "Utilizado", tone: "success" };
  }
  if (inv.revoked_at) {
    return { label: "Revogado", tone: "danger" };
  }
  if (new Date(inv.expires_at).getTime() <= Date.now()) {
    return { label: "Expirado", tone: "warning" };
  }
  return { label: "Aguardando", tone: "info" };
}

export const metadata: Metadata = { title: "Convites" };

export default async function AdminInvitationsPage() {
  const manager = await requireRole("manager");
  if (!manager) {
    return (
      <p role="alert" className="text-sm text-danger">
        Sem permissão para acessar esta página.
      </p>
    );
  }

  const invitations = await listInvitations();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Convites"
        description="Crie um convite e envie o link para a pessoa. Cada link funciona uma vez."
      />

      <CreateInvitationForm />

      {invitations.length === 0 ? (
        <EmptyState
          title="Nenhum convite"
          description="Crie o primeiro convite acima."
        />
      ) : (
        <Card flush>
          <ul className="divide-y divide-border">
            {invitations.map((inv) => {
              const status = invitationStatus(inv);
              return (
                <li
                  key={inv.id}
                  className="flex flex-col gap-3 px-4 py-3.5 transition-colors duration-150 hover:bg-sheet sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-ink">
                      {inv.email_normalized}
                    </p>
                    <p className="text-ui text-muted">
                      {ROLE_LABELS[inv.role]}, criado em{" "}
                      {formatDate(inv.created_at)}, válido até{" "}
                      {formatDate(inv.expires_at)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <Badge tone={status.tone}>{status.label}</Badge>
                    {status.label === "Aguardando" ? (
                      <RevokeInvitationButton
                        id={inv.id}
                        email={inv.email_normalized}
                      />
                    ) : null}
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
