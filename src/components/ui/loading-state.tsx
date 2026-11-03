import { LoaderCircle } from "lucide-react";

export function LoadingState({ label = "Carregando..." }: { label?: string }) {
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 p-8 text-sm text-muted"
    >
      <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
      <span>{label}</span>
    </div>
  );
}
