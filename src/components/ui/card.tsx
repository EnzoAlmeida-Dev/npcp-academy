import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export function Card({
  className,
  flush = false,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  /** Sem preenchimento interno: para listas e faixas que vao de borda a borda. */
  flush?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-card border border-border bg-surface shadow-card",
        flush ? "overflow-hidden" : "p-6",
        className,
      )}
      {...props}
    />
  );
}
