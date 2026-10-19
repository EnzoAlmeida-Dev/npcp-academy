import { redirect } from "next/navigation";

import { Card } from "@/components/ui/card";
import { LoginForm } from "@/features/auth/login-form";
import { getCurrentProfile } from "@/lib/auth/session";

export default async function LoginPage() {
  const profile = await getCurrentProfile();
  if (profile) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas p-4">
      <Card className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="font-heading text-2xl font-bold text-secondary">
            NPCP Academy
          </h1>
          <p className="text-sm text-muted">Entre na sua conta</p>
        </div>
        <LoginForm />
      </Card>
    </main>
  );
}
