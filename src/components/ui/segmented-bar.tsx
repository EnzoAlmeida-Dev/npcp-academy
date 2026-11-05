export type BarPart = { key: string; label: string; value: number; color: string };

/** Um total dividido em partes. Os valores ficam na legenda, em texto. */
export function SegmentedBar({
  parts,
  label,
}: {
  parts: BarPart[];
  label: string;
}) {
  const total = parts.reduce((sum, part) => sum + part.value, 0);
  const description = parts
    .map((part) => `${part.label}: ${part.value}`)
    .join(", ");

  return (
    <div>
      <div
        role="img"
        aria-label={`${label}. ${description}.`}
        className="flex h-2 gap-0.5"
      >
        {total === 0 ? (
          <span className="flex-1 rounded-full bg-track" />
        ) : (
          parts
            .filter((part) => part.value > 0)
            .map((part) => (
              <span
                key={part.key}
                title={`${part.label}: ${part.value} de ${total}`}
                className="min-w-1 rounded-full"
                style={{ flexGrow: part.value, backgroundColor: part.color }}
              />
            ))
        )}
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {parts.map((part) => (
          <li key={part.key} className="flex items-center gap-2 text-sm">
            <span
              aria-hidden="true"
              className="size-2.5 rounded-sm"
              style={{ backgroundColor: part.color }}
            />
            <span className="text-muted">{part.label}</span>
            <span className="font-heading font-semibold tabular-nums text-ink">
              {part.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
