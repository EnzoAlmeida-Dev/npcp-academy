/** Faixa de indicadores: uma unica superficie dividida, nao cards repetidos. */
export function StatStrip({
  stats,
}: {
  stats: { label: string; value: number }[];
}) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-border bg-border shadow-card lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-surface px-5 py-4">
          <dt className="text-ui text-muted">{stat.label}</dt>
          <dd className="mt-1 font-heading text-3xl font-semibold tracking-tight tabular-nums text-ink">
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
