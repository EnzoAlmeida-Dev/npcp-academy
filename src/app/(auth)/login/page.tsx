import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Card } from "@/components/ui/card";
import { FormMessage } from "@/components/ui/form-message";
import { LoginForm } from "@/features/auth/login-form";
import { getCurrentProfile } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const profile = await getCurrentProfile();
  if (profile) {
    redirect("/dashboard");
  }

  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas p-4">
      <Card className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="font-heading text-2xl font-bold text-secondary">
            NPCP Academy
          </h1>
          <p className="text-sm text-muted">Entre na sua conta</p>
        </div>
        {error === "confirm" ? (
          <FormMessage className="mb-4">
            Não foi possível confirmar seu e-mail. O link pode ter expirado ou
            já ter sido usado. Se já confirmou, entre abaixo; caso contrário,
            peça um novo convite à gerência.
          </FormMessage>
        ) : null}
        <LoginForm />
      </Card>
    </main>
  );
}
