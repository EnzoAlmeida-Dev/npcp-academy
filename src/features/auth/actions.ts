"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { hashToken } from "@/features/invitations/token";
import type { ActionState } from "@/lib/action-state";
import { createClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Informe e-mail e senha válidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: "E-mail ou senha inválidos." };
  }

  // Fallback: se o e-mail ja foi confirmado mas o convite ainda nao foi
  // consumido (ex.: confirmacao aberta em outro navegador/dispositivo), consome
  // agora usando o token salvo no metadata. A RPC valida token, e-mail e
  // confirmacao; e idempotente.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const inviteToken = user?.user_metadata?.invite_token;
  if (user && typeof inviteToken === "string" && inviteToken.length > 0) {
    const { error: consumeError } = await supabase.rpc("consume_invitation", {
      p_token_hash: hashToken(inviteToken),
      p_user_id: user.id,
    });

    if (consumeError) {
      console.error("[login] consume_invitation:", consumeError.message);
    }
  }

  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
