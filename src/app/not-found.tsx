import Link from "next/link";

import { ErrorState } from "@/components/ui/error-state";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas p-4">
      <div className="w-full max-w-md">
        <ErrorState
          title="Página não encontrada"
          description="O endereço não existe ou você não tem acesso a ele."
        >
          <Link
            href="/dashboard"
            className="font-heading font-semibold text-secondary underline hover:text-primary"
          >
            Ir para o dashboard
          </Link>
        </ErrorState>
      </div>
    </main>
  );
}
