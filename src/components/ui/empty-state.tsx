import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-card border border-dashed border-border-strong p-8 text-center">
      <p className="font-heading text-sm font-semibold text-ink">{title}</p>
      {description ? (
        <p className="mx-auto mt-1 max-w-prose text-sm text-muted">
          {description}
        </p>
      ) : null}
      {children}
    </div>
  );
}
