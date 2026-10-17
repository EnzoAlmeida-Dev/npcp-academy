"use client";

import { useActionState } from "react";

import type { ActionState } from "@/lib/action-state";
import { loginAction } from "@/features/auth/actions";

const initialState: ActionState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="rounded border px-3 py-2"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password">Senha</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
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
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
