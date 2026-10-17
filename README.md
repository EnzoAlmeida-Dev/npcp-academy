# NPCP Academy — documentação do MVP

Versão: 1.0 (especificação inicial)  
Status: proposta para validação antes da implementação.

## Ordem de leitura
1. `docs/product/PRD.md` — visão, escopo e requisitos.
2. `docs/product/ACCEPTANCE_CRITERIA.md` — critérios verificáveis.
3. `docs/product/USER_FLOWS.md` — fluxos principais.
4. `docs/architecture/SYSTEM_DESIGN.md` — arquitetura candidata.
5. `docs/architecture/DATA_MODEL.md` — entidades e integridade.
6. `docs/architecture/SECURITY.md` — controles mínimos de segurança.
7. `docs/decisions/ADR-001-STACK.md` — decisão tecnológica provisória.
8. `docs/implementation/IMPLEMENTATION_PLAN.md` — fases e Definition of Done.
9. `AGENTS.md` — instruções persistentes para o agente de código.

## Como usar com OpenCode
- Coloque estes arquivos na raiz de um repositório novo ou copie-os para o repositório existente.
- Peça ao agente para ler `AGENTS.md` e os documentos listados antes de implementar.
- Revise as decisões marcadas como provisórias antes de executar migrações ou publicar.
- Implemente por fatias pequenas, com testes e revisão humana em cada etapa.
- Nunca inclua segredos reais no repositório. Use `.env.example` com nomes de variáveis e valores fictícios.

## Princípio
O PRD define o que o produto deve fazer. `AGENTS.md` define como o agente deve trabalhar. Os critérios de aceitação e testes verificam se a implementação corresponde ao PRD.

---

## Desenvolvimento

Stack: Next.js + TypeScript + Supabase (Auth/Postgres/RLS) + Tailwind. Testes com Vitest.

### Requisitos

- Node.js >= 22 (projeto usa Node 24)
- Docker Desktop (para o Supabase local)
- Supabase CLI (instalada como dependência de desenvolvimento: `npx supabase`)

### Configuração

1. `npm install`
2. Suba o Supabase local: `npx supabase start`
3. Configure as variáveis de ambiente a partir de `supabase status`:
   - Crie `.env.development.local` com `NEXT_PUBLIC_SUPABASE_URL`,
     `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` e `SUPABASE_SERVICE_ROLE_KEY`
     (valores locais; nunca versionar).
   - Veja `.env.example` para a lista completa (inclui `INVITE_TTL_DAYS` e `APP_URL`).
4. Aplique as migrações no banco **local**: `npx supabase migration up`

### Bootstrap do primeiro gerente

1. Crie a conta de autenticação do gerente (dashboard ou CLI do Supabase local).
2. Execute, com confirmação explícita:

   `npm run seed:manager -- --email=gerente@exemplo.com --confirm`

   O script é idempotente, exige `--confirm`, valida exatamente uma conta e nunca
   imprime segredos. Não roda em CI.

### Comandos

- `npm run dev` — servidor de desenvolvimento.
- `npm run build` — build de produção.
- `npm run lint` — ESLint.
- `npm run typecheck` — `tsc --noEmit`.
- `npm test` — Vitest (uma execução).
- `npm run test:watch` — Vitest em modo watch.

### Migrações e seeds

- Migrações em `supabase/migrations/` (versionadas).
- Seed fictício em `supabase/seed.sql` (sem dados reais).
- Tipos do banco gerados com `npx supabase gen types typescript --local`.

### Segurança

- `SUPABASE_SERVICE_ROLE_KEY` é **exclusiva de servidor**: nunca use `NEXT_PUBLIC_*`
  para segredos, nunca versionar, nunca logar.
- `src/lib/supabase/admin.ts` é protegido com `server-only`.
- Nunca execute `db push`/`db reset` em ambiente remoto sem autorização explícita
  e identificação do alvo. Nunca execute `db reset --linked`.
