import Link from "next/link";

import { AuthLayout } from "@/components/app-shell/auth-layout";
import { StatusPanel } from "@/components/ui/status-panel";

export default function NotFound() {
  return (
    <AuthLayout>
      <StatusPanel
        title="Página não encontrada"
        message="O endereço não existe ou você não tem acesso a ele."
        tone="neutral"
      >
        <p className="mt-6 text-sm">
          <Link
            href="/dashboard"
            className="text-secondary underline underline-offset-2 transition-colors duration-150 hover:text-primary"
          >
            Ir para o dashboard
          </Link>
        </p>
      </StatusPanel>
    </AuthLayout>
  );
}
