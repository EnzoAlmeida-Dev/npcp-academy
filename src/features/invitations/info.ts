import "server-only";

import type { Role } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";

import { hashToken } from "./token";

export type InvitationInfo = {
  email_normalized: string;
  role: Role;
  is_expired: boolean;
  is_revoked: boolean;
  is_used: boolean;
};

/**
 * Resolve as informacoes publicas de um convite a partir do token.
 * Nao expoe o hash nem o estado de consumidor; o token e o proprio segredo.
 */
export async function getInvitationInfo(
  token: string,
): Promise<InvitationInfo | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_invitation_info", {
    p_token_hash: hashToken(token),
  });

  if (error || !data || data.length === 0) {
    return null;
  }

  return data[0] as InvitationInfo;
}

/**
 * Consome o convite para o usuario autenticado. Retorna false se nao houver
 * sessao ou se o convite nao for consumivel (ja usado, revogado, expirado,
 * e-mail divergente ou e-mail nao confirmado).
 */
export async function consumeInvite(token: string): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return false;
  }

  const { error } = await supabase.rpc("consume_invitation", {
    p_token_hash: hashToken(token),
    p_user_id: user.id,
  });

  return !error;
}
