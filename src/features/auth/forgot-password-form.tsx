"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusPanel } from "@/components/ui/status-panel";
import type { ActionState } from "@/lib/action-state";

import { requestPasswordResetAction } from "./password-actions";

const initialState: ActionState = {};

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    requestPasswordResetAction,
    initialState,
  );

  if (state.success) {
    return (
      <StatusPanel
        title="Verifique seu e-mail"
        message="Se houver uma conta com esse e-mail, enviamos um link para redefinir a senha. Abra o link neste mesmo navegador."
        tone="success"
      />
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <FormMessage>{state.error}</FormMessage>

      <Button type="submit" disabled={pending}>
        {pending ? "Enviando..." : "Enviar link"}
      </Button>
    </form>
  );
}
