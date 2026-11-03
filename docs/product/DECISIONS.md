# Registro de decisões — NPCP Academy

Fonte única para decisões de produto, regras de negócio e política. Os demais
documentos referenciam os IDs abaixo em vez de repetir ou reinterpretar a decisão.

- **Atualizado em:** 2026-11-03.
- IDs são estáveis: não renumerar. Nova decisão recebe o próximo ID livre.
- Status: **Decidida** (validada pelo responsável do produto), **Suposição**
  (proposta de baixo impacto e reversível, adotada até confirmação),
  **Aberta** (não implementar a parte dependente sem decisão).
- Coluna "Implementação": estado no código. Ver `docs/implementation/STATUS.md`.
- Decisões técnicas de stack ficam em `docs/decisions/` (ADRs).

## Papéis e contas

| ID | Decisão | Status | Implementação |
|---|---|---|---|
| D1 | Três papéis fixos e hierárquicos: `member` < `reviewer` < `manager`. Cada papel herda as permissões do anterior. Ver responsabilidades em `PRD.md` §5. Hierarquia aplicada no servidor **e** no RLS. | Decidida | Implementada |
| D5 | O convite define o papel inicial. Apenas a gerência cria convites e concede qualquer papel. | Decidida | Implementada |
| D6 | O primeiro gerente é criado por procedimento controlado (`npm run seed:manager`), nunca por cadastro público. | Decidida | Implementada |
| D7 | Convite é entregue por link copiável; o sistema não envia e-mail de convite. | Decidida | Implementada |
| D8 | Recuperação de senha nativa do Supabase Auth, por e-mail (SMTP Resend). | Decidida | Pendente (falta UI) |
| D9 | Desativação de conta pela gerência preenche `disabled_at` e bloqueia o acesso (servidor + RLS). Os dados do usuário são mantidos. | Decidida | Bloqueio implementado; falta ação de desativar/reativar |
| D21 | Continuidade: a gerência atual repassa os papéis de gerência e de responsável técnico às próximas levas pela própria plataforma (alteração de papel). | Decidida | Pendente |
| D22 | Confirmação de e-mail obrigatória antes da ativação. O token do convite não substitui a confirmação. (Antiga "decisão A".) | Decidida | Implementada |
| D28 | Nome de exibição é obrigatório e definido após a criação da conta, antes do uso da plataforma. O usuário pode editá-lo depois. | Decidida (edição posterior: Suposição) | Pendente (hoje é opcional no cadastro) |
| D29 | Deve existir sempre ao menos um gerente ativo: não é permitido rebaixar ou desativar o último. Ninguém altera o próprio papel. | Suposição | Pendente |
| D30 | O usuário pode excluir a própria conta. **Aberto:** o que acontece com submissões, revisões feitas por ele, evidências e XP (conflita com a exigência de histórico auditável). Opções: (a) anonimizar o perfil e manter os registros; (b) apagar os dados do usuário e anonimizar apenas as revisões que ele fez sobre entregas de outras pessoas. | Aberta | Não implementar exclusão antes da decisão |
| D34 | Termos de uso e aviso de privacidade (inclusive o que a gerência vê de cada membro): texto e forma de aceite no primeiro acesso. | Aberta | — |

## Conteúdo e trilhas

| ID | Decisão | Status | Implementação |
|---|---|---|---|
| D23 | Responsáveis técnicos (`reviewer`) e gerência criam, editam, publicam e arquivam conteúdo. Não há atribuição por trilha: qualquer responsável técnico edita qualquer trilha. | Decidida (sem atribuição por trilha: Suposição) | Pendente |
| D24 | Modo de conclusão definido pelo tipo de atividade: **conteúdo** é autodeclarado; **exercício**, **projeto** e **avaliação** exigem revisão. | Decidida (avaliação: Suposição) | Pendente |
| D25 | Evidência de entrega: URL (`http`/`https`) e/ou texto. Sem upload de arquivos. | Decidida | Pendente |
| D26 | Editar uma atividade altera o mesmo registro; progresso, submissões e evidências passadas são preservados. Não há versionamento de atividade. | Decidida | Pendente |
| D27 | Trilhas seguem uma sequência: uma trilha pode ficar bloqueada até a conclusão de trilha(s) pré-requisito. **Aberto:** quais trilhas bloqueiam quais (será configurado no conteúdo). | Decidida (mapa de pré-requisitos: Aberta) | Pendente |
| D31 | Trilhas/entregas têm prazo, ainda sem cronograma. **Aberto:** prazo por trilha ou por atividade, quem define, e o efeito do atraso (só sinalizar, bloquear envio ou afetar XP). | Aberta | Não modelar antes da decisão |
| D32 | Definição de "trilha concluída", necessária para desbloquear a próxima (D27). Proposta: todas as atividades publicadas da trilha concluídas (autodeclaradas) ou aprovadas (com revisão). | Aberta | — |
| D33 | Ordem dentro da trilha: módulos/atividades são livres ou também liberados em sequência? Proposta: livres dentro da trilha. | Aberta | — |

## Progresso, submissões e revisão

| ID | Decisão | Status | Implementação |
|---|---|---|---|
| D3 | `submissions` é a fonte de verdade do ciclo de revisão; `reviews` é imutável (uma linha por decisão). `activity_progress` não duplica estados de revisão: "aguardando revisão" e "ajustes solicitados" derivam da submissão mais recente. | Decidida | Pendente |
| D4 | Reenvio cria uma nova versão de submissão; as versões anteriores e seus feedbacks são preservados. | Decidida | Pendente |
| D19 | Não há prazo (SLA) de revisão. A gerência pode liberar ou reatribuir uma submissão assumida e parada. O revisor pode liberar a submissão que assumiu. | Decidida | Pendente |

## Competências

| ID | Decisão | Status | Implementação |
|---|---|---|---|
| D2 | Estado atual em `user_competencies` e histórico em `competency_evidence`. | Decidida | Pendente |
| D10 | A competência passa a "em desenvolvimento" quando o usuário inicia uma atividade associada a ela. | Decidida | Pendente |
| D11 | A competência passa a "demonstrada" com **uma** submissão aprovada de atividade associada. Conclusão autodeclarada nunca demonstra competência. | Decidida | Pendente |
| D12 | Correções de estado de competência são feitas por gerência ou responsáveis técnicos, como evento auditável com motivo e autor. Ninguém corrige o próprio estado. | Decidida (proibição de autocorreção: Suposição) | Pendente |

## XP, níveis e ranking

| ID | Decisão | Status | Implementação |
|---|---|---|---|
| D13 | Valores de XP por tipo de atividade e por conclusão de trilha. | Aberta | — |
| D14 | Quantidade de níveis e limites mínimos de XP por nível. | Aberta | — |
| D15 | Apenas atividades marcadas como elegíveis concedem XP, uma única vez por usuário e atividade: na conclusão (autodeclarada) ou na aprovação (com revisão). Não há teto de XP. A marcação de elegibilidade é `xp_reward > 0`. | Decidida (`xp_reward > 0` como marcação: Suposição) | Pendente |
| D16 | Correções de XP são transações compensatórias com motivo, autor e data, feitas por gerência ou responsáveis técnicos. O histórico nunca é editado. Ninguém corrige o próprio XP. | Decidida (proibição de autocorreção: Suposição) | Pendente |
| D20 | Ranking geral visível a todos os usuários ativos, exibindo apenas nome de exibição, nível e XP. Sem opção de ocultar. Empates compartilham a mesma posição. | Decidida (regra de empate: Suposição) | Pendente |
| — | Saldo de XP calculado por `SUM(xp_transactions.amount)`. | Decidida | Pendente |

## Operação e hospedagem

| ID | Decisão | Status | Implementação |
|---|---|---|---|
| D17 | Aplicação no Vercel com domínio próprio; Supabase em nuvem (região São Paulo); e-mails de autenticação via SMTP Resend. Sem restrições institucionais de hospedagem. | Decidida | Em produção |
| D18 | Dados de membros desligados são mantidos (conta desativada, D9). Exclusão a pedido do próprio usuário: ver D30. | Decidida (exclusão: Aberta) | Parcial |
| — | Convites expiram em 7 dias (`INVITE_TTL_DAYS`). | Decidida | Implementada |

## Pendências priorizadas

Antes da Fase 3 (conteúdo): D32 e D33 (afetam o modelo de pré-requisitos) —
podem ser resolvidas durante a fase se o modelo permitir.
Antes da Fase 6 (gamificação): D13 e D14.
Antes de liberar exclusão de conta: D30.
Antes do uso com membros reais: D34.
Quando houver cronograma: D31.
