"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { revokeInvitationAction } from "@/features/invitations/actions";
import type { ActionState } from "@/lib/action-state";

const initialState: ActionState = {};

export function RevokeInvitationButton({ id }: { id: string }) {
  const [state, formAction, pending] = useActionState(
    revokeInvitationAction,
    initialState,
  );

  return (
    <form action={formAction} className="inline">
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="danger" disabled={pending}>
        {pending ? "Revogando..." : "Revogar"}
      </Button>
      {state.error ? (
        <FormMessage className="mt-1">{state.error}</FormMessage>
      ) : null}
    </form>
  );
}
