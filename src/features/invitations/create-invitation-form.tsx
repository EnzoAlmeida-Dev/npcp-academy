"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { createInvitationAction } from "@/features/invitations/actions";
import type { ActionState } from "@/lib/action-state";

const initialState: ActionState = {};

export function CreateInvitationForm() {
  const [state, formAction, pending] = useActionState(
    createInvitationAction,
    initialState,
  );

  return (
    <Card>
      <form
        action={formAction}
        className="flex flex-col gap-4 sm:flex-row sm:items-end"
      >
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="email">E-mail do convidado</Label>
          <Input id="email" name="email" type="email" required />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="role">Papel</Label>
          <Select id="role" name="role" defaultValue="member">
            <option value="member">Membro</option>
            <option value="reviewer">Responsável técnico</option>
            <option value="manager">Gerência</option>
          </Select>
        </div>

        <Button type="submit" disabled={pending}>
          {pending ? "Criando..." : "Criar convite"}
        </Button>
      </form>

      {state.error ? (
        <FormMessage className="mt-3">{state.error}</FormMessage>
      ) : null}

      {state.inviteUrl ? (
        <div className="mt-3 rounded-lg border border-success/30 bg-success/10 p-3">
          <p className="text-sm font-medium text-success">
            Link de convite (copie e envie):
          </p>
          <a
            href={state.inviteUrl}
            className="break-all text-sm text-info underline"
          >
            {state.inviteUrl}
          </a>
        </div>
      ) : null}
    </Card>
  );
}
