# System Design — NPCP Academy

## Stack (ADR-001, aceita)
- Next.js 16 (App Router) + React 19 + TypeScript.
- Tailwind CSS v4.
- Supabase: Auth, PostgreSQL e RLS (nuvem, região São Paulo).
- Vercel com domínio próprio para hospedagem.
- Resend como SMTP dos e-mails de autenticação do Supabase.
- Vitest para testes unitários e de componente; ferramenta E2E a escolher.

## Princípios
1. Monólito modular, sem microserviços.
2. Regras de negócio críticas executadas no servidor; operações transacionais em funções SQL.
3. Banco relacional como fonte persistente de verdade.
4. Autorização em todas as operações, não apenas na interface.
5. Histórico auditável para revisões, XP, competências e mudanças de conta.
6. Migrações versionadas e seeds fictícios.
7. Integrações externas limitadas a links no MVP.

## Organização do código
- `src/app/` — rotas. `(auth)` para páginas públicas; `(app)` para a área autenticada (app shell exige perfil ativo).
- `src/features/<módulo>/` — server actions, consultas e componentes de cada módulo.
- `src/lib/` — autenticação/autorização (`auth/`), clientes Supabase (`supabase/`), ambiente (`env*.ts`), navegação.
- `src/components/` — app shell e componentes de UI (ver `docs/design/DESIGN_SYSTEM.md`).
- `src/proxy.ts` — renovação de sessão em cada requisição.
- `supabase/migrations/` — esquema, funções e RLS.

Módulos lógicos (pastas em `src/features/`, não serviços):
Identity & Invitations · Profiles & Accounts · Learning Paths & Content · Activity Progress · Submissions & Reviews · Competencies & Evidence · Gamification · Admin & Analytics.

## Padrão de operação
1. Server action valida a entrada (zod) e verifica papel com `requireRole()`.
2. A escrita é feita com o cliente Supabase da sessão do usuário (RLS aplicada), via tabela ou RPC.
3. Operações com várias escritas ou regras de concorrência são funções SQL `security definer` que reverificam o papel com `has_role_at_least()`.
4. A service-role não é usada pela aplicação em execução.

## Fluxos críticos no servidor
### Aprovar submissão (função SQL única)
1. Validar sessão e papel do revisor.
2. Carregar submissão com lock e verificar estado (`claimed` pelo próprio revisor).
3. Impedir autoavaliação.
4. Registrar decisão e feedback em `reviews`.
5. Atualizar submissão, progresso e competências (D11).
6. Criar transação de XP idempotente, se a atividade for elegível (D15).
7. Confirmar tudo na mesma transação.
8. Retornar estado atualizado.

### Conceder XP
- Evento de origem único; chave idempotente única por usuário e atividade.
- Valor lido de `activities.xp_reward` no banco, nunca do cliente.
- Correções via transação compensatória com motivo e autor (D16).

### Assumir revisão
- Atualização condicional: só atribuir se a submissão estiver `pending` e o autor não for o revisor.
- Conflito concorrente é resultado esperado: a interface informa e atualiza a fila.

### Alterar papel ou status de conta
- Função SQL da gerência; recusa alterar o próprio papel e deixar o sistema sem gerente ativo (D29); registra evento.

## Observabilidade mínima
- Logs de erro no servidor sem tokens, senhas ou segredos.
- Registro em banco de decisões de revisão, transações de XP e eventos de conta.
- Logs de autenticação do Supabase e de execução do Vercel.

## Ambientes
| Ambiente | Aplicação | Banco |
|---|---|---|
| Local | `npm run dev` | Supabase local (Docker), se estiver rodando; senão, o projeto em nuvem de `.env.local` |
| Produção | Vercel (domínio próprio) | Supabase em nuvem `npcp-academy` |

Hoje não há projeto Supabase separado para desenvolvimento/staging: o fallback do `npm run dev` aponta para o mesmo projeto em nuvem usado em produção. Ver risco em `docs/implementation/STATUS.md`.

## Implantação
Procedimento em `README.md`: variáveis de ambiente, aplicação de migrações, criação do primeiro gerente e configuração de Auth (confirmação de e-mail, redirects, SMTP). Rollback de aplicação pelo Vercel (redeploy de versão anterior); rollback de banco por migração corretiva, nunca por reset.
