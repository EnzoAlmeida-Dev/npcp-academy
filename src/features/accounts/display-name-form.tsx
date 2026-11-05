"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionState } from "@/lib/action-state";

import { completeOnboardingAction, updateDisplayNameAction } from "./actions";
import { DISPLAY_NAME_MAX, DISPLAY_NAME_MIN } from "./display-name";

const initialState: ActionState = {};

export function DisplayNameForm({
  mode,
  defaultValue = "",
}: {
  mode: "onboarding" | "profile";
  defaultValue?: string;
}) {
  const [state, formAction, pending] = useActionState(
    mode === "onboarding" ? completeOnboardingAction : updateDisplayNameAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="display_name">Nome de exibição</Label>
        <Input
          id="display_name"
          name="display_name"
          defaultValue={defaultValue}
          required
          minLength={DISPLAY_NAME_MIN}
          maxLength={DISPLAY_NAME_MAX}
          autoComplete="nickname"
          aria-describedby="display_name-hint"
        />
        <p id="display_name-hint" className="text-xs text-muted">
          Entre {DISPLAY_NAME_MIN} e {DISPLAY_NAME_MAX} caracteres.
        </p>
      </div>

      <FormMessage>{state.error}</FormMessage>
      {state.success && mode === "profile" ? (
        <p role="status" className="text-sm text-success">
          Nome atualizado.
        </p>
      ) : null}

      <Button type="submit" disabled={pending} className="self-start">
        {pending
          ? "Salvando..."
          : mode === "onboarding"
            ? "Continuar"
            : "Salvar nome"}
      </Button>
    </form>
  );
}
