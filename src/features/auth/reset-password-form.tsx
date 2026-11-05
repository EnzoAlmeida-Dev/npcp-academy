"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import type { ActionState } from "@/lib/action-state";
import { PASSWORD_MIN_LENGTH } from "@/lib/auth/password";

import { updatePasswordAction } from "./password-actions";

const initialState: ActionState = {};

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(
    updatePasswordAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Nova senha</Label>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
          required
          minLength={PASSWORD_MIN_LENGTH}
          maxLength={72}
          aria-describedby="password-hint"
        />
        <p id="password-hint" className="text-xs text-muted">
          Mínimo de {PASSWORD_MIN_LENGTH} caracteres.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirm">Confirme a nova senha</Label>
        <PasswordInput
          id="confirm"
          name="confirm"
          autoComplete="new-password"
          required
          minLength={PASSWORD_MIN_LENGTH}
          maxLength={72}
        />
      </div>

      <FormMessage>{state.error}</FormMessage>

      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : "Salvar nova senha"}
      </Button>
    </form>
  );
}
