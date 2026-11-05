import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthLayout } from "@/components/app-shell/auth-layout";
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
    <AuthLayout title="Entrar" description="Use o e-mail e a senha da sua conta.">
      {error === "confirm" ? (
        <FormMessage className="mb-6">
          Não foi possível confirmar seu e-mail. O link pode ter expirado ou já
          ter sido usado. Se já confirmou, entre abaixo; caso contrário, peça um
          novo convite à gerência.
        </FormMessage>
      ) : null}
      {error === "inactive" ? (
        <FormMessage className="mb-6">
          Sua conta não está ativa. Se acabou de se cadastrar, confirme o e-mail
          e abra de novo o link do convite. Se a conta foi desativada, fale com a
          gerência.
        </FormMessage>
      ) : null}
      <LoginForm />
      <p className="mt-6 text-sm">
        <Link
          href="/forgot-password"
          className="text-secondary underline underline-offset-2 transition-colors duration-150 hover:text-primary"
        >
          Esqueci a senha
        </Link>
      </p>
    </AuthLayout>
  );
}
