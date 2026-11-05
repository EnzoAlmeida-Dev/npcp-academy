import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { SectionTitle } from "@/components/ui/section-title";
import { DisplayNameForm } from "@/features/accounts/display-name-form";
import { ROLE_LABELS } from "@/lib/auth/roles";
import { getCurrentProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Meu perfil" };

function Section({
  title,
  help,
  children,
}: {
  title: string;
  help: string;
  children: ReactNode;
}) {
  return (
    <Card className="grid gap-6 md:grid-cols-[14rem_minmax(0,1fr)]">
      <div>
        <SectionTitle>{title}</SectionTitle>
        <p className="mt-1 text-ui text-muted">{help}</p>
      </div>
      <div className="max-w-md">{children}</div>
    </Card>
  );
}

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
      <PageHeader title="Meu perfil" />

      <Section
        title="Como você aparece"
        help="Seu nome no ranking e para quem revisa suas entregas."
      >
        <DisplayNameForm
          mode="profile"
          defaultValue={profile.display_name ?? ""}
        />
      </Section>

      <Section
        title="Conta"
        help="O e-mail e o papel vêm do convite. Para alterá-los, fale com a gerência."
      >
        <dl className="grid gap-3 text-sm sm:grid-cols-[6rem_minmax(0,1fr)]">
          <dt className="text-muted">E-mail</dt>
          <dd className="break-words text-ink">{user?.email ?? "—"}</dd>
          <dt className="text-muted">Papel</dt>
          <dd className="text-ink">{ROLE_LABELS[profile.role]}</dd>
          <dt className="text-muted">Senha</dt>
          <dd>
            <Link
              href="/reset-password"
              className="text-secondary underline underline-offset-2 transition-colors duration-150 hover:text-primary"
            >
              Alterar senha
            </Link>
          </dd>
        </dl>
      </Section>
    </div>
  );
}
