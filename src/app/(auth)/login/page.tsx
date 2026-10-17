import { redirect } from "next/navigation";

import { LoginForm } from "@/features/auth/login-form";
import { getCurrentProfile } from "@/lib/auth/session";

export default async function LoginPage() {
  const profile = await getCurrentProfile();
  if (profile) {
    redirect("/dashboard");
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-2xl font-semibold">Entrar</h1>
      <LoginForm />
    </main>
  );
}
