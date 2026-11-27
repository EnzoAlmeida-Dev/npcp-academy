# Registro de decisões — NPCP Academy

Fonte única para decisões de produto, regras de negócio e política. Os demais
documentos referenciam os IDs abaixo em vez de repetir ou reinterpretar a decisão.

- **Atualizado em:** 2026-11-19.
- IDs são estáveis: não renumerar. Nova decisão recebe o próximo ID livre.
- Status: **Decidida** (validada pelo responsável do produto), **Suposição**
  (proposta de baixo impacto e reversível, adotada até confirmação),
  **Aberta** (não implementar a parte dependente sem decisão).
- Coluna "Implementação": estado no código. Ver `docs/implementation/STATUS.md`.
- Decisões técnicas de stack ficam em `docs/decisions/` (ADRs).

## Papéis e contas

| ID | Decisão | Status | Implementação |
|---|---|---|---|
| D1 | Três papéis fixos e hierárquicos: `member` < `reviewer` < `manager`. Cada papel herda as permissões do anterior: a gerência também faz tudo que membros e responsáveis técnicos fazem (participa de trilhas, envia entregas, revisa). Ver responsabilidades em `PRD.md` §5. Hierarquia aplicada no servidor **e** no RLS. | Decidida | Implementada |
| D5 | O convite define o papel inicial. Apenas a gerência cria convites e concede qualquer papel. | Decidida | Implementada |
| D6 | O primeiro gerente é criado por procedimento controlado (`npm run seed:manager`), nunca por cadastro público. | Decidida | Implementada |
| D7 | Convite é entregue por link copiável; o sistema não envia e-mail de convite. | Decidida | Implementada |
| D8 | Recuperação de senha nativa do Supabase Auth, por e-mail (SMTP Resend). | Decidida | Implementada |
| D9 | Desativação de conta pela gerência preenche `disabled_at` e bloqueia o acesso (servidor + RLS). Os dados do usuário são mantidos. | Decidida | Implementada |
| D21 | Continuidade: a gerência atual repassa os papéis de gerência e de responsável técnico às próximas levas pela própria plataforma. Somente a gerência altera papéis de outras pessoas, na tela de Usuários. | Decidida | Implementada |
| D22 | Confirmação de e-mail obrigatória antes da ativação. O token do convite não substitui a confirmação. (Antiga "decisão A".) | Decidida | Implementada |
| D28 | Nome de exibição é obrigatório e definido após a criação da conta, antes do uso da plataforma. O usuário pode editá-lo depois. Tamanho: 2 a 60 caracteres (Suposição). | Decidida | Implementada |
| D29 | Deve existir sempre ao menos um gerente ativo: não é permitido rebaixar ou desativar o último. Ninguém altera o próprio papel nem desativa a própria conta. | Decidida | Implementada |
| D30 | O usuário pode excluir a própria conta. São apagados os dados pessoais da conta: perfil, credenciais, progresso em trilhas, submissões próprias, XP e competências. As revisões que a pessoa fez em entregas de outras pessoas **são mantidas, com o nome do autor** (o registro de revisão guarda uma cópia do nome do revisor). | Decidida | Pendente (Fase 8) |
| D34 | Haverá termos de uso e aviso de privacidade (inclusive o que a gerência vê de cada membro), aceitos no primeiro acesso, com versão e data registradas. O texto está em `TERMS_AND_PRIVACY.md` e informa que a plataforma está em fase de testes; **revisão jurídica recomendada** antes de abrir a todos os membros. | Decidida (texto em fase de testes) | Pendente (Fase 8) |
| D47 | Finalidade dos dados: o uso principal é o acompanhamento dos membros e a construção de planos de ação personalizados, sem relação específica com promoção. Os dados também podem ser analisados para perceber desengajamento em relação às capacitações. Não há métrica nem prazo de inatividade. | Decidida | Pendente (Fase 7) |
| D48 | Métricas de acompanhamento dos membros, com definições em `PRD.md` RB-09: nível, títulos ganhos, quantidade de atividades entregues e andamento em cada trilha, por membro; e taxa de conclusão por evento de trilha (D49), no agregado. Visíveis nos dashboards da gerência **e** dos responsáveis técnicos. Calculadas a partir dos registros da plataforma, sem dados novos sobre a pessoa. Não inclui dias sem atividade. | Decidida (detalhes das definições marcados em RB-09: Suposição) | Pendente (Fase 7) |
| D49 | Eventos de trilha: no CRUD, uma trilha pode ter eventos, cada um com nome, data de início, data de conclusão e os membros designados. A taxa de conclusão é medida por evento, só entre os membros designados, evitando contar quem não está fazendo a trilha. Uma trilha pode ter vários eventos (ex.: uma turma por semestre); o evento não bloqueia o acesso, que segue o vínculo (D44); só podem ser designados membros com acesso à trilha; responsáveis técnicos e gerência gerenciam eventos. | Decidida (vários eventos por trilha, sem efeito no acesso, designação só de quem tem acesso, quem gerencia: Suposição) | Pendente (Fases 3 e 7) |
| D50 | Prazos ficam no evento de trilha (D49). A data de conclusão do evento é o prazo da trilha e da entrega geral para os membros designados; o evento pode ter prazo próprio por bloco. Trilha sem evento não tem prazo. | Decidida | Pendente (Fase 3) |
| D51 | Implementação do vínculo (D44): ninguém altera o próprio vínculo; contas **e convites pendentes** anteriores ao vínculo passaram a efetivado; no formulário de convite, o vínculo é sugerido pelo papel (membro → trainee; responsável técnico e gerência → efetivado) e pode ser trocado. | Decidida (contas existentes: decisão do responsável do produto; convites pendentes e proibição de alterar o próprio: Suposição) | Implementada |
| D36 | Senha mínima de 8 caracteres para senhas novas ou redefinidas. Contas existentes não precisam trocar a senha. | Decidida | Implementada na aplicação; falta ajustar o painel do Supabase em nuvem |

## Conteúdo e trilhas

| ID | Decisão | Status | Implementação |
|---|---|---|---|
| D23 | Responsáveis técnicos (`reviewer`) e gerência criam, editam, publicam e arquivam conteúdo. Não há atribuição por trilha: qualquer responsável técnico edita qualquer trilha. | Decidida (sem atribuição por trilha: Suposição) | Pendente |
| D24 | ~~Modo de conclusão pelos tipos conteúdo, exercício, projeto e avaliação.~~ Substituída por D40. | Substituída | — |
| D25 | Evidência de entrega: URL (`http`/`https`) e/ou texto. Sem upload de arquivos. | Decidida | Pendente |
| D26 | Editar uma atividade altera o mesmo registro; progresso, submissões e evidências passadas são preservados. Não há versionamento de atividade. | Decidida | Pendente |
| D27 | Uma trilha pode ficar bloqueada até a conclusão de trilha(s) pré-requisito, configurado no CRUD. Padrão: para trainees, a trilha trainee é pré-requisito das demais (D44). | Decidida | Pendente |
| D31 | Prazos com sinalização de atraso. Os prazos são definidos no **evento** de trilha (D50), não na trilha nem no bloco. Opcionais, editáveis a qualquer momento. | Decidida (data absoluta para todos, atraso só sinaliza sem bloquear envio nem reduzir XP, prazo do bloco não passa do da trilha: Suposição) | Pendente |
| D32 | Bloco concluído = todos os itens publicados do bloco concluídos (vídeos) ou aprovados (entregas). Trilha concluída = todos os blocos concluídos e a entrega geral da trilha aprovada. | Decidida | Pendente |
| D33 | Liberação dos blocos: a pessoa tem acesso a todos os blocos da trilha que está fazendo, desde o início e em qualquer ordem. | Decidida | Pendente |
| D38 | Estrutura da trilha: blocos (com conteúdos e mini entregas, mais uma entrega final do bloco) e uma entrega geral da trilha, disponível durante todo o período da trilha. Substitui "módulos e atividades". Detalhes em `LEARNING_PATHS.md`. | Decidida | Pendente |
| D39 | Duas trilhas principais por público: trilha trainee (membros trainees) e trilha geral (principalmente membros efetivados). Ambas criadas pelo CRUD, não pré-criadas. | Decidida | Pendente |
| D40 | Tipos de item e conclusão: **vídeo** (link externo, prioritariamente YouTube) é autodeclarado; **questão aberta** (texto), **entrega por link** (URL), **entrega final do bloco** e **entrega geral da trilha** exigem revisão. | Decidida | Pendente |
| D43 | Trilhas são criadas por CRUD completo (trilhas, blocos, itens, títulos, entrega geral, público, pré-requisitos) por responsáveis técnicos e gerência. Nenhum esqueleto ou conteúdo de trilha é pré-criado; seeds só com dados fictícios no banco local. | Decidida | Pendente |
| D44 | Toda conta tem um vínculo, **trainee** ou **efetivado**, independente do papel. Efetivado acessa todas as trilhas; trainee precisa concluir a trilha trainee antes das demais. No CRUD, cada trilha define quais vínculos podem acessá-la. A gerência define o vínculo no convite e o altera na tela de Usuários (efetivação), com histórico; progresso, XP e títulos são mantidos. | Decidida (quem define, histórico e manutenção do progresso: Suposição; responsáveis técnicos e gerência efetivados por padrão: Suposição) | Implementada (acesso às trilhas: Fase 3b) |
| D45 | Cada bloco tem várias atividades (questões abertas, entregas por link) e uma entrega final própria; a trilha tem uma entrega geral, um projeto feito em paralelo aos blocos. A entrega geral não tem XP próprio: faz parte da conclusão da trilha. | Decidida | Pendente |

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
| D13 | Valores de XP por tipo de item (D41): vídeo 100, questão aberta 300, entrega por link 600, entrega final do bloco 1.500, conclusão da trilha 5.000. Editáveis pela gerência; mudanças não alteram XP já concedido. | Decidida | Pendente |
| D14 | Níveis abertos, sem nível máximo, calculados só pelo XP total: XP mínimo do nível *n* = 125 × *n* × (*n* − 1) (nível 2 em 250, nível 5 em 2.500, nível 9 em 9.000, nível 15 em 26.250). Limites numa tabela editável pela gerência. Metade da primeira proposta, por decisão do responsável do produto, para dar mais margem de subida em blocos com poucos vídeos. Nome dos níveis: "Nível n" por ora. | Decidida (fórmula: Suposição, ajustável com dados do piloto) | Pendente |
| D15 | ~~Apenas atividades marcadas como elegíveis concedem XP.~~ Substituída por D41. | Substituída | — |
| D16 | Correções de XP são transações compensatórias com motivo, autor e data, feitas por gerência ou responsáveis técnicos. O histórico nunca é editado. Ninguém corrige o próprio XP. | Decidida (proibição de autocorreção: Suposição) | Pendente |
| D20 | Ranking geral visível a todos os usuários ativos, exibindo apenas nome de exibição, título escolhido (D42), nível e XP. Inclui todos os papéis (membros, responsáveis técnicos e gerência). O usuário não pode se ocultar. Empates compartilham a mesma posição. | Decidida (regra de empate: Suposição) | Pendente |
| D41 | Todo item da trilha concede XP, uma única vez por pessoa e item, com peso crescente: vídeo < questão aberta < entrega por link < entrega final do bloco < conclusão da trilha. Entregas com revisão só concedem XP após aprovação. Os valores são definidos por tipo, numa tabela mantida pela gerência, não item a item. Sem teto de XP. | Decidida | Pendente |
| D42 | Cada bloco concede um título de perfil ao ser concluído, definido no CRUD do bloco. O título compõe a personalização do perfil (a pessoa escolhe qual exibir), aparece no ranking geral e é métrica no painel de usuários e nos dashboards de responsáveis técnicos e gerência. Conquistado uma vez; correções por evento auditável. | Decidida | Pendente |
| D35 | A gerência pode ocultar perfis do ranking (ex.: contas de teste). A ocultação é registrada com autor e data. | Decidida | Pendente (Fase 6) |
| — | Saldo de XP calculado por `SUM(xp_transactions.amount)`. | Decidida | Pendente |

## Operação e hospedagem

| ID | Decisão | Status | Implementação |
|---|---|---|---|
| D17 | Aplicação no Vercel com domínio próprio; Supabase em nuvem (região São Paulo); e-mails de autenticação via SMTP Resend. Sem restrições institucionais de hospedagem. | Decidida | Em produção |
| D18 | Dados de membros desligados são mantidos (conta desativada, D9). Exclusão a pedido do próprio usuário: ver D30. | Decidida (exclusão: Aberta) | Parcial |
| — | Convites expiram em 7 dias (`INVITE_TTL_DAYS`). | Decidida | Implementada |
| D37 | Integração contínua no GitHub Actions: a cada push e PR, rodar lint, typecheck, testes unitários, build e testes de integração (RLS/RPC) contra um Supabase local criado no runner. Nunca acessa o projeto de produção. | Decidida | Implementada (`.github/workflows/ci.yml`) |

## Pendências priorizadas

Antes de abrir a todos os membros: revisão jurídica do texto de D34 (`TERMS_AND_PRIVACY.md`,
questões na parte C).
Sem bloqueios para a Fase 3.
Ajustes futuros: calibrar a tabela de XP (D13) e a curva de níveis (D14) com dados do piloto;
confirmar as suposições de prazo (D31).
