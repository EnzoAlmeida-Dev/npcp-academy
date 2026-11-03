"use client";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";

export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState>
      <Button type="button" onClick={reset}>
        Tentar novamente
      </Button>
    </ErrorState>
  );
}
