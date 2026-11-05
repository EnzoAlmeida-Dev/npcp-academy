import type { ReactNode } from "react";
import { CircleAlert } from "lucide-react";

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
    <p role="alert" className={cn("flex gap-2 text-sm text-danger", className)}>
      <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}
