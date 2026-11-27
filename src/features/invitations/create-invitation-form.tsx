"use client";

import { useActionState, useState } from "react";
import { CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { createInvitationAction } from "@/features/invitations/actions";
import type { ActionState } from "@/lib/action-state";
import {
  defaultMembershipForRole,
  MEMBERSHIP_LABELS,
  MEMBERSHIPS,
  type Membership,
} from "@/lib/auth/membership";
import type { Role } from "@/lib/auth/roles";

const initialState: ActionState = {};

export function CreateInvitationForm() {
  const [state, formAction, pending] = useActionState(
    createInvitationAction,
    initialState,
  );
  const [role, setRole] = useState<Role>("member");
  const [membership, setMembership] = useState<Membership>("trainee");

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
          <Select
            id="role"
            name="role"
            value={role}
            onChange={(event) => {
              const next = event.target.value as Role;
              setRole(next);
              // Sugestao pelo papel; a gerencia pode trocar em seguida.
              setMembership(defaultMembershipForRole(next));
            }}
          >
            <option value="member">Membro</option>
            <option value="reviewer">Responsável técnico</option>
            <option value="manager">Gerência</option>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="membership">Vínculo</Label>
          <Select
            id="membership"
            name="membership"
            value={membership}
            onChange={(event) =>
              setMembership(event.target.value as Membership)
            }
          >
            {MEMBERSHIPS.map((value) => (
              <option key={value} value={value}>
                {MEMBERSHIP_LABELS[value]}
              </option>
            ))}
          </Select>
        </div>

        <Button type="submit" disabled={pending}>
          {pending ? "Criando..." : "Criar convite"}
        </Button>
      </form>

      {state.error ? (
        <FormMessage className="mt-4">{state.error}</FormMessage>
      ) : null}

      {state.inviteUrl ? (
        <div className="mt-4 rounded-lg border border-border bg-sheet p-4">
          <p className="flex items-center gap-2 text-sm text-ink">
            <CircleCheck aria-hidden="true" className="size-4 text-success" />
            Convite criado. Copie o link e envie à pessoa convidada.
          </p>
          <p className="mt-2 break-all rounded-md border border-border bg-surface px-2.5 py-1.5 text-ui text-ink">
            {state.inviteUrl}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <CopyButton value={state.inviteUrl} />
          </div>
          <p className="mt-2 text-xs text-muted">
            Este link é exibido apenas agora e não pode ser recuperado depois.
            Se perdê-lo, revogue o convite e crie outro.
          </p>
        </div>
      ) : null}
    </Card>
  );
}
