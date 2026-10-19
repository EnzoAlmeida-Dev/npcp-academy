import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export function FormMessage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  if (!children) {
    return null;
  }
  return (
    <p role="alert" className={cn("text-sm text-danger", className)}>
      {children}
    </p>
  );
}
