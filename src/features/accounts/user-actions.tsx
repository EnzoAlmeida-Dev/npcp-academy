"use client";

import { useActionState, useState } from "react";
import { UserCheck, UserX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FormMessage } from "@/components/ui/form-message";
import { Select } from "@/components/ui/select";
import type { ActionState } from "@/lib/action-state";
import { ROLE_LABELS, type Role } from "@/lib/auth/roles";

import { changeUserRoleAction, setUserDisabledAction } from "./actions";

const initialState: ActionState = {};
const ROLES: Role[] = ["member", "reviewer", "manager"];

function ChangeRole({
  userId,
  name,
  role,
}: {
  userId: string;
  name: string;
  role: Role;
}) {
  const [selected, setSelected] = useState<Role>(role);
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    async (prev: ActionState, formData: FormData) => {
      const result = await changeUserRoleAction(prev, formData);
      if (result.success) {
        setOpen(false);
      }
      return result;
    },
    initialState,
  );

  const selectId = `role-${userId}`;

  return (
    <div className="flex items-center gap-2">
      <label htmlFor={selectId} className="sr-only">
        Papel de {name}
      </label>
      <Select
        compact
        id={selectId}
        value={selected}
        onChange={(event) => setSelected(event.target.value as Role)}
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {ROLE_LABELS[r]}
          </option>
        ))}
      </Select>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={selected === role}
        onClick={() => setOpen(true)}
      >
        Alterar
        <span className="sr-only"> papel de {name}</span>
      </Button>

      <ConfirmDialog
        open={open}
        title="Alterar papel?"
        description={`${name} passará de ${ROLE_LABELS[role]} para ${ROLE_LABELS[selected]}. A mudança vale a partir do próximo acesso e fica registrada.`}
        onClose={() => setOpen(false)}
      >
        <form action={formAction}>
          <input type="hidden" name="user_id" value={userId} />
          <input type="hidden" name="role" value={selected} />
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
  disabled,
}: {
  userId: string;
  name: string;
  role: Role;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <ChangeRole userId={userId} name={name} role={role} />
      <ToggleDisabled userId={userId} name={name} disabled={disabled} />
    </div>
  );
}
