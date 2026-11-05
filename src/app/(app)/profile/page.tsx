import type { Metadata } from "next";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { DisplayNameForm } from "@/features/accounts/display-name-form";
import { ROLE_LABELS } from "@/lib/auth/roles";
import { getCurrentProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Meu perfil" };

export default async function ProfilePage() {
  const profile = await getCurrentProfile();
  if (!profile) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Meu perfil" description="Seus dados na plataforma." />

      <Card>
        <h2 className="mb-4 font-heading text-lg font-semibold text-secondary">
          Nome de exibição
        </h2>
        <DisplayNameForm
          mode="profile"
          defaultValue={profile.display_name ?? ""}
        />
      </Card>

      <Card>
        <h2 className="mb-4 font-heading text-lg font-semibold text-secondary">
          Conta
        </h2>
        <dl className="grid gap-3 text-sm sm:grid-cols-[10rem_1fr]">
          <dt className="text-muted">E-mail</dt>
          <dd className="text-ink">{user?.email ?? "—"}</dd>
          <dt className="text-muted">Papel</dt>
          <dd className="text-ink">{ROLE_LABELS[profile.role]}</dd>
          <dt className="text-muted">Senha</dt>
          <dd>
            <Link
              href="/reset-password"
              className="text-secondary underline hover:text-primary"
            >
              Alterar senha
            </Link>
          </dd>
        </dl>
        <p className="mt-4 text-xs text-muted">
          O e-mail e o papel são definidos pelo convite. Para alterá-los, fale
          com a gerência.
        </p>
      </Card>
    </div>
  );
}
