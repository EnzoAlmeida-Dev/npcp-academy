import type { ReactNode } from "react";
import {
  CircleAlert,
  CircleCheck,
  Info,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/cn";

import type { BadgeTone } from "./badge";

const tones: Record<BadgeTone, { icon: LucideIcon; color: string }> = {
  neutral: { icon: Info, color: "text-muted" },
  success: { icon: CircleCheck, color: "text-success" },
  danger: { icon: CircleAlert, color: "text-danger" },
  warning: { icon: TriangleAlert, color: "text-warning" },
  info: { icon: Info, color: "text-info" },
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
  const { icon: Icon, color } = tones[tone];

  return (
    <div>
      <Icon aria-hidden="true" className={cn("mb-4 size-6", color)} />
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">
        {title}
      </h1>
      {message ? <p className="mt-2 text-sm text-muted">{message}</p> : null}
      {children}
    </div>
  );
}
