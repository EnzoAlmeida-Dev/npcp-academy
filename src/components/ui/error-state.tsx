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
      className="rounded-card border border-danger/40 bg-surface p-8 text-center shadow-card"
    >
      <TriangleAlert
        aria-hidden="true"
        className="mx-auto mb-3 size-8 text-danger"
      />
      <p className="font-heading font-semibold text-secondary">{title}</p>
      <p className="mt-1 text-sm text-muted">{description}</p>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
