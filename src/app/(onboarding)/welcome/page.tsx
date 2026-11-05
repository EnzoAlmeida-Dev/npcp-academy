import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Card } from "@/components/ui/card";
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
    <main className="flex min-h-screen items-center justify-center bg-canvas p-4">
      <Card className="w-full max-w-md">
        <h1 className="font-heading text-2xl font-bold text-secondary">
          Boas-vindas ao NPCP Academy
        </h1>
        <p className="mb-6 mt-1 text-sm text-muted">
          Antes de começar, escolha como seu nome vai aparecer na plataforma.
          Você pode mudar depois em “Meu perfil”.
        </p>
        <DisplayNameForm mode="onboarding" />
      </Card>
    </main>
  );
}
