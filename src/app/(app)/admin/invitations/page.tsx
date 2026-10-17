import { CreateInvitationForm } from "@/features/invitations/create-invitation-form";
import { listInvitations } from "@/features/invitations/queries";
import { RevokeInvitationButton } from "@/features/invitations/revoke-invitation-button";
import { requireRole } from "@/lib/auth/authorize";
import { ROLE_LABELS } from "@/lib/auth/roles";

function invitationStatus(inv: {
  used_at: string | null;
  revoked_at: string | null;
  expires_at: string;
}): string {
  if (inv.used_at) {
    return "utilizado";
  }
  if (inv.revoked_at) {
    return "revogado";
  }
  if (new Date(inv.expires_at).getTime() <= Date.now()) {
    return "expirado";
  }
  return "aguardando";
}

export default async function AdminInvitationsPage() {
  const manager = await requireRole("manager");
  if (!manager) {
    return (
      <p role="alert" className="text-sm text-red-600">
        Sem permissão para acessar esta página.
      </p>
    );
  }

  const invitations = await listInvitations();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Convites</h1>

      <CreateInvitationForm />

      <ul className="flex flex-col gap-2">
        {invitations.length === 0 ? (
          <li className="text-sm text-zinc-600">Nenhum convite criado.</li>
        ) : null}
        {invitations.map((inv) => (
          <li
            key={inv.id}
            className="flex items-center justify-between gap-4 rounded border px-4 py-2"
          >
            <div className="flex flex-col">
              <span className="font-medium">{inv.email_normalized}</span>
              <span className="text-sm text-zinc-600">
                {ROLE_LABELS[inv.role]} · {invitationStatus(inv)}
              </span>
            </div>
            {inv.used_at === null && inv.revoked_at === null ? (
              <RevokeInvitationButton id={inv.id} />
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
