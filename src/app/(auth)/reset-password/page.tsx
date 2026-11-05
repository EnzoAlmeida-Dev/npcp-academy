import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Card } from "@/components/ui/card";
import { ResetPasswordForm } from "@/features/auth/reset-password-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Nova senha" };

// Acessada pelo link de recuperacao (sessao criada em /auth/confirm)
// ou por "Meu perfil" para quem ja esta autenticado.
export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/forgot-password?error=link");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas p-4">
      <Card className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="font-heading text-2xl font-bold text-secondary">
            Definir nova senha
          </h1>
        </div>
        <ResetPasswordForm />
      </Card>
    </main>
  );
}
