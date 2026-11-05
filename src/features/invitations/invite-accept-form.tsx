"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormMessage } from "@/components/ui/form-message";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { StatusPanel } from "@/components/ui/status-panel";
import { signUpForInviteAction } from "@/features/invitations/actions";
import type { ActionState } from "@/lib/action-state";
import { PASSWORD_MIN_LENGTH } from "@/lib/auth/password";

const initialState: ActionState = {};

export function InviteAcceptForm({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  const [state, formAction, pending] = useActionState(
    signUpForInviteAction,
    initialState,
  );

  if (state.success) {
    return (
      <StatusPanel
        title="Confirme seu e-mail"
        message={`Enviamos um link de confirmação para ${email}. Abra o e-mail e clique no link para concluir o cadastro.`}
        tone="success"
      />
    );
  }

  return (
    <Card>
      <h1 className="mb-6 text-center font-heading text-2xl font-bold text-secondary">
        Aceitar convite
      </h1>

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="token" value={token} />

        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted">E-mail convidado</span>
          <span className="font-medium text-ink">{email}</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Senha</Label>
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

        <FormMessage>{state.error}</FormMessage>

        <Button type="submit" disabled={pending}>
          {pending ? "Criando..." : "Criar conta"}
        </Button>
      </form>
    </Card>
  );
}
