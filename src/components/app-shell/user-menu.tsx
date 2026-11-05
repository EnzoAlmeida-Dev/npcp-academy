import Link from "next/link";
import { LogOut } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { logoutAction } from "@/features/auth/actions";

/** Nome e papel levam ao perfil; o botao ao lado encerra a sessao. */
export function UserMenu({
  name,
  role,
  onNavigate,
}: {
  name: string;
  role: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <Link
        href="/profile"
        onClick={onNavigate}
        className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg p-1.5 transition-colors duration-150 hover:bg-ink/5"
      >
        <Avatar name={name} />
        <span className="min-w-0">
          <span className="block truncate text-sm text-ink">{name}</span>
          <span className="block truncate text-xs text-muted">{role}</span>
        </span>
      </Link>
      <form action={logoutAction}>
        <button
          type="submit"
          title="Sair"
          className="flex size-9 items-center justify-center rounded-lg text-muted transition-colors duration-150 hover:bg-ink/5 hover:text-ink"
        >
          <LogOut aria-hidden="true" className="size-4" />
          <span className="sr-only">Sair</span>
        </button>
      </form>
    </div>
  );
}
