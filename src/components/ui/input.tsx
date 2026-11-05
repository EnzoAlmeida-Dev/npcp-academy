import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 rounded-lg border border-field-border bg-surface px-3 text-sm text-ink transition-colors duration-150 placeholder:text-muted hover:border-ink/60",
        className,
      )}
      {...props}
    />
  );
}
