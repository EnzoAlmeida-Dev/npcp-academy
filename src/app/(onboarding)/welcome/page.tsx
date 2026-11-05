import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthLayout } from "@/components/app-shell/auth-layout";
import { DisplayNameForm } from "@/features/accounts/display-name-form";
import { getCurrentProfile } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Boas-vindas" };

// Primeiro acesso: o nome de exibicao e obrigatorio antes do uso (D28).
export default async function WelcomePage() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/login");
  }
  if (profile.display_name) {
    redirect("/dashboard");
  }

  return (
    <AuthLayout
      title="Boas-vindas"
      description="Escolha como seu nome vai aparecer na plataforma. Você pode mudar depois em Meu perfil."
    >
      <DisplayNameForm mode="onboarding" />
    </AuthLayout>
  );
}
