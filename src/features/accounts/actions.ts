"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { ActionState } from "@/lib/action-state";
import { requireRole } from "@/lib/auth/authorize";
import { createClient } from "@/lib/supabase/server";

import { displayNameSchema } from "./display-name";
import { accountErrorMessage } from "./errors";

async function saveDisplayName(formData: FormData): Promise<ActionState> {
  const parsed = displayNameSchema.safeParse(formData.get("display_name"));
  if (!parsed.success) {
    return { error: accountErrorMessage("invalid_display_name") };
  }

  // A funcao SQL usa auth.uid(); o cliente nao escolhe de quem e o nome.
  const supabase = await createClient();
  const { error } = await supabase.rpc("set_display_name", {
    p_display_name: parsed.data,
  });

  if (error) {
    return { error: accountErrorMessage(error.message) };
  }
  return { success: true };
}

/** Primeiro acesso: define o nome e segue para o dashboard. */
export async function completeOnboardingAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = await saveDisplayName(formData);
  if (result.error) {
    return result;
  }
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

/** Edicao posterior do nome em "Meu perfil". */
export async function updateDisplayNameAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = await saveDisplayName(formData);
  if (!result.error) {
    revalidatePath("/", "layout");
  }
  return result;
}

const changeRoleSchema = z.object({
  user_id: z.uuid(),
  role: z.enum(["member", "reviewer", "manager"]),
});

export async function changeUserRoleAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await requireRole("manager"))) {
    return { error: accountErrorMessage("not_authorized") };
  }

  const parsed = changeRoleSchema.safeParse({
    user_id: formData.get("user_id"),
    role: formData.get("role"),
  });
  if (!parsed.success) {
    return { error: accountErrorMessage("invalid_input") };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("change_user_role", {
    p_user_id: parsed.data.user_id,
    p_role: parsed.data.role,
  });

  if (error) {
    return { error: accountErrorMessage(error.message) };
  }
  revalidatePath("/admin/users");
  return { success: true };
}

const setDisabledSchema = z.object({
  user_id: z.uuid(),
  disabled: z.enum(["true", "false"]),
});

export async function setUserDisabledAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await requireRole("manager"))) {
    return { error: accountErrorMessage("not_authorized") };
  }

  const parsed = setDisabledSchema.safeParse({
    user_id: formData.get("user_id"),
    disabled: formData.get("disabled"),
  });
  if (!parsed.success) {
    return { error: accountErrorMessage("invalid_input") };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("set_user_disabled", {
    p_user_id: parsed.data.user_id,
    p_disabled: parsed.data.disabled === "true",
  });

  if (error) {
    return { error: accountErrorMessage(error.message) };
  }
  revalidatePath("/admin/users");
  return { success: true };
}

const changeMembershipSchema = z.object({
  user_id: z.uuid(),
  membership: z.enum(["trainee", "efetivado"]),
});

/** Efetivacao e demais mudancas de vinculo (D44). Somente gerencia. */
export async function changeUserMembershipAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await requireRole("manager"))) {
    return { error: accountErrorMessage("not_authorized") };
  }

  const parsed = changeMembershipSchema.safeParse({
    user_id: formData.get("user_id"),
    membership: formData.get("membership"),
  });
  if (!parsed.success) {
    return { error: accountErrorMessage("invalid_input") };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("set_user_membership", {
    p_user_id: parsed.data.user_id,
    p_membership: parsed.data.membership,
  });

  if (error) {
    return { error: accountErrorMessage(error.message) };
  }
  revalidatePath("/admin/users");
  return { success: true };
}
