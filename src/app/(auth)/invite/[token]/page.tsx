import { redirect } from "next/navigation";

import { consumeInvite, getInvitationInfo } from "@/features/invitations/info";
import { InviteAcceptForm } from "@/features/invitations/invite-accept-form";
import { createClient } from "@/lib/supabase/server";

function Status({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2 rounded border p-6">
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="text-sm text-zinc-600">{message}</p>
    </div>
  );
}

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const info = await getInvitationInfo(token);

  if (!info) {
    return <Status title="Convite inválido" message="Este link não é válido." />;
  }
  if (info.is_used) {
    return (
      <Status
        title="Convite já utilizado"
        message="Este convite já foi utilizado."
      />
    );
  }
  if (info.is_revoked) {
    return (
      <Status
        title="Convite revogado"
        message="Este convite foi revogado. Solicite um novo."
      />
    );
  }
  if (info.is_expired) {
    return (
      <Status
        title="Convite expirado"
        message="Este convite expirou. Solicite um novo."
      />
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const ok = await consumeInvite(token);
    if (ok) {
      redirect("/dashboard");
    }
    return (
      <Status
        title="Não foi possível concluir"
        message="O convite não corresponde ao e-mail desta conta."
      />
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-2xl font-semibold">Aceitar convite</h1>
      <InviteAcceptForm token={token} email={info.email_normalized} />
    </main>
  );
}
