import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type BadgeTone = "neutral" | "success" | "danger" | "warning" | "info";

const dots: Record<Exclude<BadgeTone, "neutral">, string> = {
  success: "bg-success",
  danger: "bg-danger",
  warning: "bg-warning",
  info: "bg-info",
};

/** Base neutra; o estado vem do texto, com um ponto de cor como apoio. */
export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs text-ink",
        className,
      )}
    >
      {tone === "neutral" ? null : (
        <span
          aria-hidden="true"
          className={cn("size-1.5 rounded-full", dots[tone])}
        />
      )}
      {children}
    </span>
  );
}
