const MESSAGES: Record<string, string> = {
  not_authorized: "Você não tem permissão para esta ação.",
  cannot_change_own_role: "Você não pode alterar o próprio papel.",
  cannot_change_own_status: "Você não pode desativar a própria conta.",
  cannot_change_own_membership: "Você não pode alterar o próprio vínculo.",
  last_manager:
    "Esta ação deixaria a plataforma sem gerente ativo. Promova outra pessoa à gerência antes.",
  user_not_found: "Usuário não encontrado.",
  user_not_activated:
    "A conta ainda não foi ativada. O papel e o vínculo iniciais vêm do convite.",
  invalid_display_name: "O nome deve ter entre 2 e 60 caracteres.",
  invalid_input: "Dados inválidos.",
};

/**
 * Traduz o codigo de erro levantado pelas funcoes SQL de contas em uma
 * mensagem para a interface. Erros desconhecidos viram mensagem generica.
 */
export function accountErrorMessage(message: string | undefined): string {
  const code = Object.keys(MESSAGES).find((key) => message?.includes(key));
  return code ? MESSAGES[code] : "Não foi possível concluir a ação.";
}
