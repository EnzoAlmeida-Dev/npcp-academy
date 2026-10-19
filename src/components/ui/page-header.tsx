import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-heading text-2xl font-bold text-secondary">
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-muted">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
