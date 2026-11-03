"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "./button";

export function CopyButton({ value }: { value: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 3000);
  }

  return (
    <>
      <Button type="button" variant="secondary" onClick={copy}>
        {state === "copied" ? (
          <Check aria-hidden="true" className="size-4" />
        ) : (
          <Copy aria-hidden="true" className="size-4" />
        )}
        {state === "copied" ? "Copiado" : "Copiar link"}
      </Button>
      <span role="status" className="sr-only">
        {state === "copied"
          ? "Link copiado."
          : state === "failed"
            ? "Não foi possível copiar. Selecione o link manualmente."
            : ""}
      </span>
      {state === "failed" ? (
        <span aria-hidden="true" className="text-sm text-danger">
          Não foi possível copiar. Selecione o link manualmente.
        </span>
      ) : null}
    </>
  );
}
