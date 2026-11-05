import { cn } from "@/lib/cn";

/**
 * Progresso em chevrons: um segmento por etapa, na ordem em que as etapas se
 * liberam. O texto com os valores fica a cargo de quem usa o componente.
 */
export function ProgressChevrons({
  value,
  total,
  label,
  className,
}: {
  value: number;
  total: number;
  label: string;
  className?: string;
}) {
  const safeTotal = Math.max(0, Math.floor(total));
  const filled = Math.min(Math.max(0, Math.floor(value)), safeTotal);

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={safeTotal}
      aria-valuenow={filled}
      className={cn("flex h-4", className)}
    >
      {Array.from({ length: safeTotal }, (_, index) => (
        <span
          key={index}
          data-filled={index < filled}
          style={
            index < filled
              ? { animationDelay: `${index * 90}ms` }
              : undefined
          }
          className={cn(
            "chevron-segment -ml-[5px] flex-1 first:ml-0",
            index < filled
              ? "animate-chevron-in bg-secondary"
              : "bg-track",
          )}
        />
      ))}
    </div>
  );
}
