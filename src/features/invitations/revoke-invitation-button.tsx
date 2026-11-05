"use client";

import { useActionState, useState } from "react";
import { Ban } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FormMessage } from "@/components/ui/form-message";
import { revokeInvitationAction } from "@/features/invitations/actions";
import type { ActionState } from "@/lib/action-state";

const initialState: ActionState = {};

export function RevokeInvitationButton({
  id,
  email,
}: {
  id: string;
  email: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    revokeInvitationAction,
    initialState,
  );

  return (
    <>
      <Button
        type="button"
        variant="danger"
        size="sm"
        onClick={() => setOpen(true)}
      >
        <Ban aria-hidden="true" className="size-4" />
        Revogar
        <span className="sr-only"> convite de {email}</span>
      </Button>

      <ConfirmDialog
        open={open}
        title="Revogar convite?"
        description={`O link enviado para ${email} deixará de funcionar. Esta ação não pode ser desfeita; será preciso criar um novo convite.`}
        onClose={() => setOpen(false)}
      >
        <form action={formAction}>
          <input type="hidden" name="id" value={id} />
          <Button type="submit" variant="danger" disabled={pending}>
            {pending ? "Revogando..." : "Revogar convite"}
          </Button>
        </form>
        {state.error ? <FormMessage>{state.error}</FormMessage> : null}
      </ConfirmDialog>
    </>
  );
}
