import type { Metadata } from "next";
import Link from "next/link";

import { AuthLayout } from "@/components/app-shell/auth-layout";
import { FormMessage } from "@/components/ui/form-message";
import { ForgotPasswordForm } from "@/features/auth/forgot-password-form";

export const metadata: Metadata = { title: "Recuperar senha" };

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthLayout
      title="Recuperar senha"
      description="Informe o e-mail da sua conta para receber um link."
    >
      {error === "link" ? (
        <FormMessage className="mb-6">
          O link de recuperação é inválido ou expirou. Solicite um novo e abra-o
          no mesmo navegador em que fez o pedido.
        </FormMessage>
      ) : null}
      <ForgotPasswordForm />
      <p className="mt-6 text-sm">
        <Link
          href="/login"
          className="text-secondary underline underline-offset-2 transition-colors duration-150 hover:text-primary"
        >
          Voltar para o login
        </Link>
      </p>
    </AuthLayout>
  );
}
