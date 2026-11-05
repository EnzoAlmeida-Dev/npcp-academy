import type { ReactNode } from "react";

export function SectionTitle({
  id,
  children,
}: {
  id?: string;
  children: ReactNode;
}) {
  return (
    <h2
      id={id}
      className="font-heading text-base font-semibold tracking-tight text-ink"
    >
      {children}
    </h2>
  );
}
