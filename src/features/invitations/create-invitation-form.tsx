"use client";

import { useActionState } from "react";

import type { ActionState } from "@/lib/action-state";
import { createInvitationAction } from "@/features/invitations/actions";

const initialState: ActionState = {};

export function CreateInvitationForm() {
  const [state, formAction, pending] = useActionState(
    createInvitationAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="flex w-full max-w-xl flex-col gap-3 rounded border p-4"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="email">E-mail do convidado</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="rounded border px-3 py-2"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="role">Papel</label>
        <select
          id="role"
          name="role"
          defaultValue="member"
          className="rounded border px-3 py-2"
        >
          <option value="member">Membro</option>
          <option value="reviewer">Responsável técnico</option>
          <option value="manager">Gerência</option>
        </select>
      </div>

      {state.error ? (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-zinc-900 px-3 py-2 text-white disabled:opacity-60"
      >
        {pending ? "Criando..." : "Criar convite"}
      </button>

      {state.inviteUrl ? (
        <div className="flex flex-col gap-1 rounded border border-green-200 bg-green-50 p-3">
          <span className="text-sm font-medium">
            Link de convite (copie e envie):
          </span>
          <a
            href={state.inviteUrl}
            className="break-all text-sm text-blue-700 underline"
          >
            {state.inviteUrl}
          </a>
        </div>
      ) : null}
    </form>
  );
}
