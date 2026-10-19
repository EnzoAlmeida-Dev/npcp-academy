import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { StatusPanel } from "@/components/ui/status-panel";
import { consumeInvite, getInvitationInfo } from "@/features/invitations/info";
import { InviteAcceptForm } from "@/features/invitations/invite-accept-form";
import { createClient } from "@/lib/supabase/server";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const info = await getInvitationInfo(token);

  let content: ReactNode;

  if (!info) {
    content = (
      <StatusPanel
        title="Convite inválido"
        message="Este link não é válido."
        tone="danger"
      />
    );
  } else if (info.is_used) {
    content = (
      <StatusPanel
        title="Convite já utilizado"
        message="Este convite já foi utilizado."
        tone="warning"
      />
    );
  } else if (info.is_revoked) {
    content = (
      <StatusPanel
        title="Convite revogado"
        message="Este convite foi revogado. Solicite um novo."
        tone="danger"
      />
    );
  } else if (info.is_expired) {
    content = (
      <StatusPanel
        title="Convite expirado"
        message="Este convite expirou. Solicite um novo."
        tone="warning"
      />
    );
  } else {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const ok = await consumeInvite(token);
      if (ok) {
        redirect("/dashboard");
      }
      content = (
        <StatusPanel
          title="Não foi possível concluir"
          message="O convite não corresponde ao e-mail desta conta."
          tone="danger"
        />
      );
    } else {
      content = <InviteAcceptForm token={token} email={info.email_normalized} />;
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas p-4">
      <div className="w-full max-w-sm">{content}</div>
    </main>
  );
}
