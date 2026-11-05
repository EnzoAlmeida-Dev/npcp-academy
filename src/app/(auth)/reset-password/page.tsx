import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthLayout } from "@/components/app-shell/auth-layout";
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
    <AuthLayout title="Definir nova senha">
      <ResetPasswordForm />
    </AuthLayout>
  );
}
