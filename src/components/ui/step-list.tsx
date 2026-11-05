import { Check, CircleDot, Lock } from "lucide-react";

import { cn } from "@/lib/cn";

export type StepStatus = "done" | "current" | "locked";

export type Step = {
  key: string;
  title: string;
  description?: string;
  status: StepStatus;
};

const STATUS_TEXT: Record<StepStatus, string> = {
  done: "concluída",
  current: "em andamento",
  locked: "bloqueada",
};

function StepMark({ status }: { status: StepStatus }) {
  if (status === "done") {
    return (
      <span className="flex size-6 items-center justify-center rounded-full bg-secondary text-white">
        <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />
      </span>
    );
  }
  if (status === "current") {
    return (
      <span className="flex size-6 items-center justify-center rounded-full border border-secondary bg-surface text-secondary">
        <CircleDot aria-hidden="true" className="size-3.5" />
      </span>
    );
  }
  return (
    <span className="flex size-6 items-center justify-center rounded-full border border-border-strong bg-surface text-muted">
      <Lock aria-hidden="true" className="size-3" />
    </span>
  );
}

/** Etapas em sequencia, ligadas por um trilho. Ordem = ordem de liberacao. */
export function StepList({ steps }: { steps: Step[] }) {
  return (
    <ol className="flex flex-col">
      {steps.map((step, index) => (
        <li key={step.key} className="relative flex gap-3 pb-5 last:pb-0">
          {index < steps.length - 1 ? (
            <span
              aria-hidden="true"
              className={cn(
                "absolute bottom-0 left-3 top-6 w-px -translate-x-1/2",
                step.status === "done" ? "bg-secondary" : "bg-border-strong",
              )}
            />
          ) : null}
          <StepMark status={step.status} />
          <div className="min-w-0 pt-0.5">
            <p
              className={cn(
                "text-sm",
                step.status === "locked" ? "text-muted" : "text-ink",
              )}
            >
              {step.title}
              <span className="sr-only"> ({STATUS_TEXT[step.status]})</span>
            </p>
            {step.description ? (
              <p className="mt-0.5 text-ui text-muted">{step.description}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
