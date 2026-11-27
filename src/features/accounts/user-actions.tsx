"use client";

import { useActionState, useState } from "react";
import { UserCheck, UserX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FormMessage } from "@/components/ui/form-message";
import { Select } from "@/components/ui/select";
import type { ActionState } from "@/lib/action-state";
import {
  MEMBERSHIP_LABELS,
  MEMBERSHIPS,
  type Membership,
} from "@/lib/auth/membership";
import { ROLE_LABELS, type Role } from "@/lib/auth/roles";

import {
  changeUserMembershipAction,
  changeUserRoleAction,
  setUserDisabledAction,
} from "./actions";

const initialState: ActionState = {};
const ROLES: Role[] = ["member", "reviewer", "manager"];

type Action = (prev: ActionState, formData: FormData) => Promise<ActionState>;

/** Escolha de um valor (papel ou vinculo) com confirmacao antes de salvar. */
function ChangeChoice<T extends string>({
  userId,
  name,
  current,
  options,
  labels,
  field,
  fieldLabel,
  action,
  title,
  note,
}: {
  userId: string;
  name: string;
  current: T;
  options: T[];
  labels: Record<T, string>;
  field: "role" | "membership";
  fieldLabel: string;
  action: Action;
  title: string;
  note: string;
}) {
  const [selected, setSelected] = useState<T>(current);
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    async (prev: ActionState, formData: FormData) => {
      const result = await action(prev, formData);
      if (result.success) {
        setOpen(false);
      }
      return result;
    },
    initialState,
  );

  const selectId = `${field}-${userId}`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={selectId} className="text-xs text-muted">
        {fieldLabel}
        <span className="sr-only"> de {name}</span>
      </label>
      <div className="flex items-center gap-2">
        <Select
          compact
          id={selectId}
          value={selected}
          onChange={(event) => setSelected(event.target.value as T)}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {labels[option]}
            </option>
          ))}
        </Select>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={selected === current}
          onClick={() => setOpen(true)}
        >
          Alterar
          <span className="sr-only">
            {" "}
            {fieldLabel.toLowerCase()} de {name}
          </span>
        </Button>
      </div>

      <ConfirmDialog
        open={open}
        title={title}
        description={`${name} passará de ${labels[current]} para ${labels[selected]}. ${note}`}
        onClose={() => setOpen(false)}
      >
        <form action={formAction}>
          <input type="hidden" name="user_id" value={userId} />
          <input type="hidden" name={field} value={selected} />
          <Button type="submit" disabled={pending}>
            {pending ? "Alterando..." : "Confirmar alteração"}
          </Button>
        </form>
        {state.error ? <FormMessage>{state.error}</FormMessage> : null}
      </ConfirmDialog>
    </div>
  );
}

function ToggleDisabled({
  userId,
  name,
  disabled,
}: {
  userId: string;
  name: string;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    async (prev: ActionState, formData: FormData) => {
      const result = await setUserDisabledAction(prev, formData);
      if (result.success) {
        setOpen(false);
      }
      return result;
    },
    initialState,
  );

  return (
    <>
      <Button
        type="button"
        variant={disabled ? "secondary" : "danger"}
        size="sm"
        onClick={() => setOpen(true)}
      >
        {disabled ? (
          <UserCheck aria-hidden="true" className="size-4" />
        ) : (
          <UserX aria-hidden="true" className="size-4" />
        )}
        {disabled ? "Reativar" : "Desativar"}
        <span className="sr-only"> conta de {name}</span>
      </Button>

      <ConfirmDialog
        open={open}
        title={disabled ? "Reativar conta?" : "Desativar conta?"}
        description={
          disabled
            ? `${name} voltará a acessar a plataforma, com os dados preservados.`
            : `${name} perderá o acesso imediatamente. Os dados são mantidos e a conta pode ser reativada depois.`
        }
        onClose={() => setOpen(false)}
      >
        <form action={formAction}>
          <input type="hidden" name="user_id" value={userId} />
          <input type="hidden" name="disabled" value={String(!disabled)} />
          <Button
            type="submit"
            variant={disabled ? "primary" : "danger"}
            disabled={pending}
          >
            {pending
              ? "Salvando..."
              : disabled
                ? "Reativar conta"
                : "Desativar conta"}
          </Button>
        </form>
        {state.error ? <FormMessage>{state.error}</FormMessage> : null}
      </ConfirmDialog>
    </>
  );
}

export function UserActions({
  userId,
  name,
  role,
  membership,
  disabled,
}: {
  userId: string;
  name: string;
  role: Role;
  membership: Membership;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <ChangeChoice
        userId={userId}
        name={name}
        current={role}
        options={ROLES}
        labels={ROLE_LABELS}
        field="role"
        fieldLabel="Papel"
        action={changeUserRoleAction}
        title="Alterar papel?"
        note="A mudança vale a partir do próximo acesso e fica registrada."
      />
      <ChangeChoice
        userId={userId}
        name={name}
        current={membership}
        options={MEMBERSHIPS}
        labels={MEMBERSHIP_LABELS}
        field="membership"
        fieldLabel="Vínculo"
        action={changeUserMembershipAction}
        title="Alterar vínculo?"
        note="O vínculo define o acesso às trilhas. Progresso, XP e títulos são mantidos, e a mudança fica registrada."
      />
      <ToggleDisabled userId={userId} name={name} disabled={disabled} />
    </div>
  );
}
