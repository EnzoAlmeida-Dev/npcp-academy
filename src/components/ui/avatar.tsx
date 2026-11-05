import { cn } from "@/lib/cn";
import { initials } from "@/lib/format";

/** Iniciais do nome; o nome completo sempre aparece ao lado, em texto. */
export function Avatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-lg bg-ink font-heading text-xs font-medium text-white",
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
