# Plano incremental de implementação

Estado atual de cada fase em `STATUS.md`. Referências `Dnn` apontam para `docs/product/DECISIONS.md`. Cada fase só começa com as decisões indicadas resolvidas.

| Fase | Tema | Estado | Decisões necessárias |
|---|---|---|---|
| 0 | Alinhamento | Concluída (pendências listadas em `DECISIONS.md`) | — |
| 1 | Fundação | Concluída | — |
| 2 | Identidade e convites | Concluída | — |
| 2b | Contas e qualidade | Concluída | D28, D29, D36, D37 |
| 3 | Conteúdo e trilhas (CRUD) | Em andamento (3a concluída localmente) | D27, D31, D33, D38–D40, D43–D45, D49, D50 |
| 4 | Progresso e autodeclaração | Planejada | D10, D40, D41 |
| 5 | Submissões e revisão | Planejada | D3, D4, D19, D25 |
| 6 | Competências, XP, títulos e ranking | Planejada | D2, D11, D12, D16, D20, D41, D42; D13 e D14 (decididas) |
| 7 | Painel gerencial | Planejada | — |
| 8 | Endurecimento e lançamento | Planejada | D30, D34 |

## Fase 1 — Fundação (concluída)
Projeto, lint, typecheck, testes, estrutura de features, ambientes, conexão com banco, primeira migração, README e `.env.example`.

## Fase 2 — Identidade e convites (concluída)
Login/logout, criação, consumo, expiração e revogação de convites, perfis e papéis, autorização no servidor e RLS, confirmação de e-mail.

## Fase 2b — Contas e qualidade (concluída)
Implementar:
- etapa obrigatória de nome de exibição após ativação e edição posterior (D28);
- recuperação de senha (D8);
- alteração de papel, desativação e reativação pela gerência, com registro de eventos (D9, D21, D29);
- suíte de integração de RLS/RPC executável por comando documentado, migrando os scripts E2E atuais;
- senha mínima de 8 caracteres (D36);
- CI no GitHub Actions (D37).

Aceitação:
- AC-41 a AC-46 e AC-53 passam;
- usuário não altera o próprio papel; último gerente protegido;
- conta desativada perde acesso imediatamente.

## Fase 3 — Conteúdo e trilhas (CRUD)
Especificação: `docs/product/LEARNING_PATHS.md`.

Implementar:
- vínculo trainee/efetivado nas contas e nos convites (D44);
- esquema de trilhas (com vínculos de acesso), pré-requisitos, blocos, itens e competências;
- **edição completa depois de criado**, inclusive em conteúdo publicado: textos, links de vídeo,
  critérios, títulos de bloco, vínculos de acesso, pré-requisitos e ordem (pedido do responsável
  do produto; D26: edição altera o mesmo registro e preserva o histórico);
- CRUD completo para responsáveis técnicos e gerência: trilhas, blocos, itens, título de cada
  bloco, entrega geral, público e pré-requisitos, com rascunho/publicação/arquivamento;
- catálogo e página da trilha com blocos, itens e indicação de bloqueio;
- eventos de trilha no CRUD: nome, período e membros designados (D49);
- prazos no evento de trilha, com prazo opcional por bloco e sinalização de atraso (D31, D50);
- seed apenas com dados fictícios no banco local, para desenvolvimento e testes. Nenhuma
  trilha é criada em produção por script (D43).

Aceitação:
- AC-06 a AC-10, AC-47, AC-48, AC-54, AC-57 a AC-60, AC-64;
- membro vê apenas conteúdo publicado do seu público e não edita conteúdo;
- conteúdo pode ser atualizado sem apagar histórico.

## Fase 4 — Progresso e autodeclaração
Implementar:
- progresso individual;
- iniciar/concluir atividade de conteúdo;
- bloqueio por pré-requisito no servidor;
- livro de XP e concessão idempotente para atividades elegíveis (os valores podem ser placeholders até D13);
- estados vazio, carregamento e erro.

Aceitação:
- AC-11, AC-12, AC-13, AC-28, AC-29, AC-30, AC-51;
- membro não altera progresso alheio.

## Fase 5 — Submissões e revisão compartilhada
Implementar:
- envio de evidências (URL/texto) e versões;
- fila compartilhada;
- assumir, liberar e reatribuir revisão;
- aprovação/solicitação de ajustes com feedback e histórico;
- bloqueio de autoavaliação.

Aceitação:
- AC-14 a AC-22, AC-34, AC-49.

## Fase 6 — Competências e gamificação
Implementar:
- estados e evidências de competência;
- correções de competência e de XP;
- regras de níveis;
- perfil individual;
- tabela de XP por tipo (D41, D13), níveis (D14) e títulos por bloco (D42), exibidos no perfil, no ranking e nos painéis;
- ranking geral, com ocultação de perfis pela gerência (D35).

Aceitação:
- AC-23 a AC-27, AC-31 a AC-33, AC-50, AC-52, AC-55, AC-56.

## Fase 7 — Painel gerencial
Implementar:
- progresso agregado por trilha;
- competências demonstradas;
- fila e idade das submissões;
- métricas de acompanhamento por membro (nível, títulos, atividades entregues, andamento nas trilhas) e taxa de conclusão por evento de trilha, nos dashboards da gerência e dos responsáveis técnicos e no painel de usuários (D48, RB-09);
- filtros mínimos.

Aceitação:
- AC-35, AC-36, AC-62, AC-63;
- indicadores usam definições documentadas (`PRD.md` §10);
- consultas não revelam dados além do necessário.

## Fase 8 — Endurecimento e lançamento
Implementar/verificar:
- testes E2E dos fluxos principais;
- testes de autorização para todos os papéis;
- acessibilidade e responsividade;
- erros e logs;
- exclusão de conta (D30) e aceite versionado dos termos e do aviso de privacidade (D34, AC-61), com texto revisado pelo jurídico;
- seed de demonstração sem dados pessoais;
- procedimento de backup e rollback.

Aceitação:
- todos os critérios Must Have passam;
- checklist de `SECURITY.md` completo;
- limitações e riscos conhecidos documentados em `STATUS.md`.

## Definition of Done para cada tarefa
- Critérios de aceitação satisfeitos.
- Testes relevantes criados e executados.
- Autorização verificada para sucesso e falha.
- `STATUS.md` atualizado; `DECISIONS.md` atualizado se uma decisão ou suposição foi tomada.
- Documentação de arquitetura atualizada quando o comportamento mudar.
- Sem segredos ou dados reais em commits.
- Resumo de mudanças, testes, pressupostos e riscos entregue.
