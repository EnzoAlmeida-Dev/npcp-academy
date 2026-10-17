"use client";

import { useActionState } from "react";

import type { ActionState } from "@/lib/action-state";
import { revokeInvitationAction } from "@/features/invitations/actions";

const initialState: ActionState = {};

export function RevokeInvitationButton({ id }: { id: string }) {
  const [state, formAction, pending] = useActionState(
    revokeInvitationAction,
    initialState,
  );

  return (
    <form action={formAction} className="inline">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        className="text-sm text-red-700 underline disabled:opacity-60"
      >
        {pending ? "Revogando..." : "Revogar"}
      </button>
      {state.error ? (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
