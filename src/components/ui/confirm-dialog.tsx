"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

import { Button } from "./button";

const FOCUSABLE = "button:not([disabled]), [href], input, select, textarea";

/**
 * Dialogo modal de confirmacao. Fecha com Esc ou clique no fundo, mantem o
 * foco dentro dele e devolve o foco ao elemento que o abriu.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  /** Acoes (botao de confirmar). O botao "Cancelar" ja e incluido. */
  children: ReactNode;
}) {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const previous = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !panel) {
        return;
      }
      const items = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (items.length === 0) {
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className="w-full max-w-md animate-dialog-in rounded-card border border-border bg-surface p-6 shadow-overlay"
      >
        <h2
          id={titleId}
          className="font-heading text-lg font-semibold tracking-tight text-ink"
        >
          {title}
        </h2>
        {description ? (
          <p id={descId} className="mt-2 text-sm text-muted">
            {description}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            data-autofocus
            onClick={onClose}
          >
            Cancelar
          </Button>
          {children}
        </div>
      </div>
    </div>
  );
}
