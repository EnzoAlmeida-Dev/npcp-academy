import type { ReactNode } from "react";
import { TriangleAlert } from "lucide-react";

export function ErrorState({
  title = "Algo deu errado",
  description = "Não foi possível carregar esta página. Tente novamente.",
  children,
}: {
  title?: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div
      role="alert"
      className="rounded-card border border-border bg-surface p-8 shadow-card"
    >
      <TriangleAlert aria-hidden="true" className="mb-3 size-5 text-danger" />
      <p className="font-heading text-base font-semibold tracking-tight text-ink">
        {title}
      </p>
      <p className="mt-1 max-w-prose text-sm text-muted">{description}</p>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
