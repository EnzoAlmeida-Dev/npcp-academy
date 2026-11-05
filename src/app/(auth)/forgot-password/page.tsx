import type { Metadata } from "next";
import Link from "next/link";

import { Card } from "@/components/ui/card";
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
    <main className="flex min-h-screen items-center justify-center bg-canvas p-4">
      <Card className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="font-heading text-2xl font-bold text-secondary">
            Recuperar senha
          </h1>
          <p className="text-sm text-muted">
            Informe o e-mail da sua conta para receber um link.
          </p>
        </div>
        {error === "link" ? (
          <FormMessage className="mb-4">
            O link de recuperação é inválido ou expirou. Solicite um novo e
            abra-o no mesmo navegador em que fez o pedido.
          </FormMessage>
        ) : null}
        <ForgotPasswordForm />
        <p className="mt-6 text-center text-sm">
          <Link
            href="/login"
            className="text-secondary underline hover:text-primary"
          >
            Voltar para o login
          </Link>
        </p>
      </Card>
    </main>
  );
}
