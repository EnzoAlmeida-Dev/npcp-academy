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
10. `docs/implementation/ETAPA-1_HANDOFF.md` — registro de decisões e mudanças da Etapa 1 (continuidade/backup).

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

- Node.js >= 22 (o projeto declara `engines.node`; usa Node 24 localmente).
- **Opcional:** Docker Desktop + Supabase CLI, apenas para o Supabase **local**.
- Para a nuvem (recomendado para Vercel) não é necessário Docker.

### Ambientes (local × nuvem)

- `.env.local` — **alvo ativo** (nuvem ou local). Versão de referência: `.env.example`.
- `.env.development.local` — override opcional do Supabase **local** (Docker).
  É ignorado pelo Git.

O comando `npm run dev` (`scripts/dev.mjs`) escolhe automaticamente:
1. Se o Supabase **local** responder, usa `.env.development.local`.
2. Caso contrário, se existir `.env.local`, usa a **nuvem** (fallback) — assim
   "esquecer o Docker" não quebra o desenvolvimento.

Diagnóstico: `npm run check:supabase` (mostra alvo e conectividade, sem expor valores).
Para rodar o Next direto, sem o launcher: `npm run dev:next`.

### Configuração

1. `npm install`
2. Nuvem (recomendado): preencha `.env.local` com URL, publishable key,
   `SUPABASE_SERVICE_ROLE_KEY` (apenas para bootstrap), `INVITE_TTL_DAYS` e `APP_URL`.
3. Local (opcional): `npx supabase start` e crie `.env.development.local` com os
   valores de `npx supabase status`; aplique migrações com `npx supabase migration up`.

### Bootstrap do primeiro gerente

- Nuvem: `npm run seed:manager -- --email=gerente@exemplo.com --confirm`
- Local: `npm run seed:manager:local -- --email=gerente@exemplo.com --confirm`

O script é idempotente, exige `--confirm`, valida exatamente uma conta, informa se
o alvo é local/nuvem e nunca imprime segredos. Não roda em CI.

### Comandos

- `npm run dev` — dev com seleção automática de ambiente.
- `npm run dev:next` — dev sem o launcher.
- `npm run check:supabase` — conectividade dos ambientes.
- `npm run build` / `npm run start` — produção.
- `npm run lint` / `npm run typecheck` / `npm test` / `npm run test:watch`.

### Migrações e seeds

- Migrações em `supabase/migrations/` (versionadas).
- Seed fictício em `supabase/seed.sql` (sem dados reais).
- Tipos do banco: `npx supabase gen types typescript --local`.
- **Nuvem:** aplicar migrações exige identificar e confirmar o alvo
  (`npx supabase link --project-ref <ref>` + `npx supabase db push`).
  Nunca execute `db reset --linked`.

### Vercel (hospedagem gratuita)

O app é um Next.js padrão e não usa Docker em runtime. No painel do Vercel:

1. Importe o repositório (Framework: Next.js; plano Hobby/gratuito).
2. Configure as Environment Variables (produção):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only; só para bootstrap)
   - `INVITE_TTL_DAYS` (ex.: `7`)
   - `APP_URL` = URL do deploy (ex.: `https://seu-projeto.vercel.app`)
     (se omitido, o app usa `VERCEL_PROJECT_PRODUCTION_URL`/`VERCEL_URL`).
3. No projeto Supabase **em nuvem**:
   - Habilite **confirmação de e-mail**.
   - Adicione a URL do deploy à **allowlist de redirects**.
   - Aplique as migrações no projeto correto.
   - Configure SMTP para e-mails (o serviço padrão do Supabase tem limite baixo;
     para um piloto, use um SMTP próprio, ex.: Resend).

Observações de custo/limites: Vercel Hobby é gratuito para uso não comercial;
o Supabase gratuito pode pausar por inatividade e tem limite de e-mails. Nenhum
serviço local (Docker/CLI) é necessário para o app rodar no Vercel.

### Segurança

- `SUPABASE_SERVICE_ROLE_KEY` é **exclusiva de servidor**: nunca use `NEXT_PUBLIC_*`
  para segredos, nunca versionar, nunca logar.
- `src/lib/supabase/admin.ts` e `src/lib/env.server.ts` são protegidos com `server-only`.
- Nunca execute `db push`/`db reset` em ambiente remoto sem autorização explícita
  e identificação do alvo. Nunca execute `db reset --linked`.
