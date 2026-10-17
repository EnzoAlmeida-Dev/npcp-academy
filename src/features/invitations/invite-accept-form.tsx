"use client";

import { useActionState } from "react";

import type { ActionState } from "@/lib/action-state";
import { signUpForInviteAction } from "@/features/invitations/actions";

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
      <div className="flex w-full max-w-sm flex-col gap-3 rounded border p-6">
        <p className="font-medium">Confirme seu e-mail</p>
        <p className="text-sm text-zinc-600">
          Enviamos um link de confirmação para <strong>{email}</strong>. Abra o
          e-mail e clique no link para concluir o cadastro.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-3">
      <input type="hidden" name="token" value={token} />

      <div className="flex flex-col gap-1">
        <span className="text-sm text-zinc-500">E-mail convidado</span>
        <span className="font-medium">{email}</span>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="display_name">Nome de exibição (opcional)</label>
        <input
          id="display_name"
          name="display_name"
          maxLength={120}
          className="rounded border px-3 py-2"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password">Senha</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          className="rounded border px-3 py-2"
        />
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
        {pending ? "Criando..." : "Criar conta"}
      </button>
    </form>
  );
}
