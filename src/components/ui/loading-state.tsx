/** Esqueleto de pagina: reserva o espaco e evita saltos de layout. */
export function LoadingState({ label = "Carregando..." }: { label?: string }) {
  return (
    <div role="status" className="flex flex-col gap-6">
      <span className="sr-only">{label}</span>
      <div aria-hidden="true" className="h-8 w-56 animate-pulse rounded-lg bg-track" />
      <div aria-hidden="true" className="h-24 animate-pulse rounded-card bg-track/70" />
      <div aria-hidden="true" className="h-56 animate-pulse rounded-card bg-track/50" />
    </div>
  );
}
