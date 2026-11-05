import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "md" | "sm";
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-primary text-white shadow-raised hover:bg-primary-hover",
  secondary:
    "border border-border-strong bg-surface text-ink shadow-card hover:border-field-border hover:bg-sheet",
  ghost: "text-muted hover:bg-ink/5 hover:text-ink",
  danger:
    "border border-border-strong bg-surface text-danger shadow-card hover:border-danger/50 hover:bg-danger/5",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  md: "h-10 px-4",
  sm: "h-8 px-3",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-heading text-ui font-semibold transition-[background-color,border-color,color,transform] duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-60",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
