# Plano incremental de implementação

Estado atual de cada fase em `STATUS.md`. Referências `Dnn` apontam para `docs/product/DECISIONS.md`. Cada fase só começa com as decisões indicadas resolvidas.

| Fase | Tema | Estado | Decisões necessárias |
|---|---|---|---|
| 0 | Alinhamento | Concluída (pendências listadas em `DECISIONS.md`) | — |
| 1 | Fundação | Concluída | — |
| 2 | Identidade e convites | Concluída | — |
| 2b | Contas e qualidade | Próxima | D28, D29 (D30 só para exclusão) |
| 3 | Conteúdo e trilhas | Planejada | D23–D27; D32/D33 durante a fase |
| 4 | Progresso e autodeclaração | Planejada | D10, D15, D24 |
| 5 | Submissões e revisão | Planejada | D3, D4, D19, D25 |
| 6 | Competências e gamificação | Planejada | D2, D11, D12, D16, D20; **D13, D14 abertas** |
| 7 | Painel gerencial | Planejada | — |
| 8 | Endurecimento e lançamento | Planejada | D30, D34 |

## Fase 1 — Fundação (concluída)
Projeto, lint, typecheck, testes, estrutura de features, ambientes, conexão com banco, primeira migração, README e `.env.example`.

## Fase 2 — Identidade e convites (concluída)
Login/logout, criação, consumo, expiração e revogação de convites, perfis e papéis, autorização no servidor e RLS, confirmação de e-mail.

## Fase 2b — Contas e qualidade
Implementar:
- etapa obrigatória de nome de exibição após ativação e edição posterior (D28);
- recuperação de senha (D8);
- alteração de papel, desativação e reativação pela gerência, com registro de eventos (D9, D21, D29);
- suíte de integração de RLS/RPC executável por comando documentado, migrando os scripts E2E atuais;
- revisão da senha mínima.

Aceitação:
- AC-41 a AC-46 passam;
- usuário não altera o próprio papel; último gerente protegido;
- conta desativada perde acesso imediatamente.

## Fase 3 — Conteúdo e trilhas
Implementar:
- esquema de trilhas, pré-requisitos, módulos, atividades, recursos e competências;
- gestão de conteúdo por responsáveis técnicos e gerência, com rascunho/publicação/arquivamento;
- catálogo e páginas de trilha, com indicação de bloqueio;
- seed fictício de uma trilha piloto de desenvolvimento web.

Aceitação:
- AC-06 a AC-10, AC-47, AC-48;
- membro vê apenas conteúdo publicado e não edita conteúdo;
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
- ranking geral.

Aceitação:
- AC-23 a AC-27, AC-31 a AC-33, AC-50.

## Fase 7 — Painel gerencial
Implementar:
- progresso agregado por trilha;
- competências demonstradas;
- fila e idade das submissões;
- filtros mínimos.

Aceitação:
- AC-35, AC-36;
- indicadores usam definições documentadas (`PRD.md` §10);
- consultas não revelam dados além do necessário.

## Fase 8 — Endurecimento e lançamento
Implementar/verificar:
- testes E2E dos fluxos principais;
- testes de autorização para todos os papéis;
- acessibilidade e responsividade;
- erros e logs;
- exclusão de conta (após D30) e termos/aviso de privacidade (D34);
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
