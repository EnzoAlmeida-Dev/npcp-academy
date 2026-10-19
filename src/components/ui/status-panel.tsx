import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import type { BadgeTone } from "./badge";

const accents: Record<BadgeTone, string> = {
  neutral: "border-border",
  success: "border-success/40",
  danger: "border-danger/40",
  warning: "border-warning/40",
  info: "border-info/40",
};

export function StatusPanel({
  title,
  message,
  tone = "neutral",
  children,
}: {
  title: string;
  message?: string;
  tone?: BadgeTone;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-card border bg-surface p-6 shadow-card",
        accents[tone],
      )}
    >
      <h1 className="font-heading text-xl font-bold text-secondary">{title}</h1>
      {message ? <p className="mt-2 text-sm text-muted">{message}</p> : null}
      {children}
    </div>
  );
}
