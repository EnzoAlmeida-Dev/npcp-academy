"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import type { ActionState } from "@/lib/action-state";
import { newPasswordSchema, PASSWORD_MIN_LENGTH } from "@/lib/auth/password";
import { getAppServerEnv } from "@/lib/env.server";
import { createClient } from "@/lib/supabase/server";

export async function requestPasswordResetAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z.email().safeParse(formData.get("email"));
  if (!parsed.success) {
    return { error: "Informe um e-mail válido." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${getAppServerEnv().APP_URL}/auth/confirm?next=/reset-password`,
  });

  if (error) {
    console.error("[recovery] Supabase retornou erro:", error.status ?? "n/a");
    if (error.status === 429) {
      return {
        error: "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
      };
    }
  }

  // Resposta identica exista ou nao a conta (nao revela cadastro).
  return { success: true };
}

const updatePasswordSchema = z
  .object({ password: newPasswordSchema, confirm: z.string() })
  .refine((data) => data.password === data.confirm, { path: ["confirm"] });

export async function updatePasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = updatePasswordSchema.safeParse({
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });
  if (!parsed.success) {
    const mismatch = parsed.error.issues.some((i) => i.path[0] === "confirm");
    return {
      error: mismatch
        ? "As senhas não coincidem."
        : `A senha deve ter entre ${PASSWORD_MIN_LENGTH} e 72 caracteres.`,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Sessão expirada. Solicite um novo link de recuperação." };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) {
    console.error("[recovery] updateUser:", error.status ?? "n/a");
    return {
      error:
        error.code === "same_password"
          ? "A nova senha deve ser diferente da atual."
          : "Não foi possível alterar a senha.",
    };
  }

  redirect("/dashboard");
}
