# Plano incremental de implementação

## Fase 0 — Alinhamento
Entregáveis:
- Confirmar stack e provedor.
- Resolver regras iniciais de convite, papéis, XP, níveis e competências.
- Criar backlog ligado aos IDs do PRD.
- Definir seed fictício da trilha piloto.

Saída: nenhuma decisão crítica de segurança ou de negócio permanece implícita.

## Fase 1 — Fundação
Implementar:
- projeto, lint, typecheck e testes;
- estrutura de features;
- configuração de ambientes;
- conexão com banco;
- primeira migração;
- README e `.env.example`.

Aceitação:
- aplicação roda localmente;
- migrações são reproduzíveis;
- segredos não estão versionados;
- lint, typecheck, testes e build passam.

## Fase 2 — Identidade e convites
Implementar:
- login/logout;
- criação e consumo de convite;
- expiração e revogação;
- perfis e papéis;
- autorização no servidor e políticas no banco.

Aceitação:
- convite válido funciona uma vez;
- convite usado/expirado falha;
- membro não acessa rotas administrativas;
- testes negativos de acesso passam.

## Fase 3 — Conteúdo e trilhas
Implementar:
- CRUD de trilhas, módulos, atividades e competências;
- rascunho/publicação;
- catálogo e páginas de trilha;
- links de aulas externas;
- seed de uma trilha piloto de desenvolvimento web.

Aceitação:
- responsável autorizado cria e publica conteúdo;
- membro vê apenas conteúdo publicado;
- conteúdo pode ser atualizado sem apagar histórico.

## Fase 4 — Progresso e autodeclaração
Implementar:
- progresso individual;
- iniciar/concluir atividade simples;
- estado vazio, carregamento e erros;
- regra idempotente de recompensa para conclusão autodeclarada.

Aceitação:
- progresso é individual;
- repetição da requisição não duplica XP;
- membro não altera progresso alheio.

## Fase 5 — Submissões e revisão compartilhada
Implementar:
- envio de evidências;
- fila compartilhada;
- operação atômica de assumir revisão;
- aprovação/solicitação de ajustes;
- feedback e histórico;
- bloqueio de autoavaliação.

Aceitação:
- concorrência não gera dois revisores atribuídos;
- decisão registra revisor e data;
- aprovação e XP são consistentes;
- reenvio preserva versões.

## Fase 6 — Competências e gamificação
Implementar:
- estados de competência;
- evidências de competência;
- livro de transações de XP;
- regras de níveis;
- perfil individual;
- ranking geral.

Aceitação:
- competência demonstrada exige evidência aprovada;
- XP não é alterável pelo cliente;
- recompensa é única por evento;
- regra de empate do ranking é estável.

## Fase 7 — Painel gerencial
Implementar:
- progresso agregado por trilha;
- competências demonstradas;
- fila e idade das submissões;
- filtros mínimos.

Aceitação:
- apenas papéis autorizados acessam métricas gerenciais;
- indicadores usam definições documentadas;
- consultas não revelam dados além do necessário.

## Fase 8 — Endurecimento e lançamento
Implementar/verificar:
- testes E2E dos fluxos principais;
- testes de autorização;
- acessibilidade e responsividade;
- erros e logs;
- migrações de produção;
- seed de demonstração sem dados pessoais;
- implantação e procedimento de rollback.

Aceitação:
- todos os critérios Must Have passam;
- procedimento de implantação foi executado;
- limitações e riscos conhecidos estão documentados.

## Definition of Done para cada tarefa
- Critérios de aceitação satisfeitos.
- Testes relevantes criados e executados.
- Autorização verificada para sucesso e falha.
- Documentação atualizada quando necessária.
- Sem segredos ou dados reais em commits.
- Resumo de mudanças, testes, pressupostos e riscos entregue.
