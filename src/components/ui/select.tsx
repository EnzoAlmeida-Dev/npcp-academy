import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export function Select({
  className,
  compact = false,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { compact?: boolean }) {
  return (
    <select
      className={cn(
        "rounded-lg border border-field-border bg-surface text-ink transition-colors duration-150 hover:border-ink/60",
        compact ? "h-8 px-2 text-ui" : "h-10 px-3 text-sm",
        className,
      )}
      {...props}
    />
  );
}
