# NPCP Academy

Plataforma interna de capacitação técnica para membros e trainees do Núcleo de Projetos de Computação (NPCP), começando por uma trilha piloto de desenvolvimento web.

Stack: Next.js + TypeScript + Supabase (Auth/Postgres/RLS) + Tailwind, hospedado no Vercel. Estado atual em [`docs/implementation/STATUS.md`](docs/implementation/STATUS.md).

## Documentação

| Documento | Conteúdo |
|---|---|
| [`AGENTS.md`](AGENTS.md) | Como o agente de código deve trabalhar neste repositório |
| [`docs/product/PRD.md`](docs/product/PRD.md) | Visão, papéis, escopo, requisitos e regras de negócio |
| [`docs/product/DECISIONS.md`](docs/product/DECISIONS.md) | Decisões de produto tomadas, suposições e itens em aberto |
| [`docs/product/LEARNING_PATHS.md`](docs/product/LEARNING_PATHS.md) | Estrutura das trilhas, CRUD, XP e títulos |
| [`docs/product/TERMS_AND_PRIVACY.md`](docs/product/TERMS_AND_PRIVACY.md) | Termos de uso e aviso de privacidade (fase de testes) |
| [`docs/product/ACCEPTANCE_CRITERIA.md`](docs/product/ACCEPTANCE_CRITERIA.md) | Critérios verificáveis e testes negativos obrigatórios |
| [`docs/product/USER_FLOWS.md`](docs/product/USER_FLOWS.md) | Fluxos e mapa de navegação por papel |
| [`docs/architecture/SYSTEM_DESIGN.md`](docs/architecture/SYSTEM_DESIGN.md) | Arquitetura, organização do código, fluxos críticos e ambientes |
| [`docs/architecture/DATA_MODEL.md`](docs/architecture/DATA_MODEL.md) | Esquema implementado e planejado |
| [`docs/architecture/SECURITY.md`](docs/architecture/SECURITY.md) | Ameaças, controles, matriz de autorização e checklist |
| [`docs/decisions/`](docs/decisions/) | ADRs técnicos |
| [`docs/design/DESIGN_SYSTEM.md`](docs/design/DESIGN_SYSTEM.md) | Tokens, componentes, estados de tela e acessibilidade |
| [`docs/implementation/IMPLEMENTATION_PLAN.md`](docs/implementation/IMPLEMENTATION_PLAN.md) | Fases, aceitação e Definition of Done |
| [`docs/implementation/STATUS.md`](docs/implementation/STATUS.md) | O que está implementado, testes, lacunas, riscos e armadilhas |

## Desenvolvimento

### Requisitos
- Node.js >= 22 (`engines.node`).
- Opcional: Docker Desktop, para o Supabase local (Supabase CLI já é devDependency).

### Ambientes (local × nuvem)
- `.env.local` — alvo ativo (nuvem). Modelo: `.env.example`.
- `.env.development.local` — override opcional do Supabase **local** (Docker).

Ambos são ignorados pelo Git. Salve-os em UTF-8 **sem BOM**.

`npm run dev` (`scripts/dev.mjs`) escolhe o alvo:
1. se o Supabase local responder, usa `.env.development.local`;
2. senão, usa `.env.local` (nuvem).

> Atenção: hoje o projeto em nuvem é o de produção. Sem o Supabase local rodando, o desenvolvimento usa dados de produção.

Diagnóstico sem expor valores: `npm run check:supabase`.

### Configuração local
```powershell
npm install
npx supabase start
# gera .env.development.local a partir do Supabase local (nao imprime chaves;
# recusa URL que nao seja local):
npx supabase status -o env | node scripts/write-local-env.mjs
npx supabase migration up
npm run dev        # http://127.0.0.1:3000 (use 127.0.0.1, não localhost)
```

- Studio: `http://127.0.0.1:55424` · Mailpit (e-mails locais): `http://127.0.0.1:55425`.
- Contas de teste locais: `node --env-file-if-exists=.env.development.local scripts/seed-local-test-accounts.mjs`.

### Bootstrap do primeiro gerente
- Nuvem: `npm run seed:manager -- --email=gerente@exemplo.com --confirm`
- Local: `npm run seed:manager:local -- --email=gerente@exemplo.com --confirm`

O script é idempotente, exige `--confirm`, cria a conta de auth se não existir (senha temporária em `MANAGER_PASSWORD`, nunca impressa), informa se o alvo é local ou nuvem e não roda em CI. Exige `SUPABASE_SERVICE_ROLE_KEY` no ambiente local de quem executa.

### Comandos
| Comando | Uso |
|---|---|
| `npm run dev` | Dev com seleção automática de ambiente |
| `npm run dev:next` | Dev sem o launcher |
| `npm run check:supabase` | Conectividade dos ambientes |
| `npm run lint` / `npm run typecheck` | Qualidade |
| `npm test` / `npm run test:watch` | Testes unitários e de componente (Vitest) |
| `npm run test:integration` | Testes de RLS e funções SQL contra o Supabase **local** (exige `npx supabase start`) |
| `npm run build` / `npm run start` | Produção (não rodar `build` com `dev` ativo) |

Verificação manual do fluxo de convite com e-mail (Supabase local + Mailpit): `node --env-file-if-exists=.env.development.local scripts/e2e-invite-email.mjs`.

### Integração contínua
`.github/workflows/ci.yml` roda a cada push e PR: lint, typecheck, testes, build e, em outro job, `test:integration` contra um Supabase local criado no runner. Nunca usa o projeto de produção. Para exigir CI verde antes do merge, ative a proteção da branch `main` no GitHub (Settings → Branches).

### Migrações e seeds
- Migrações versionadas em `supabase/migrations/`. Mudança de esquema sempre por nova migração.
- Seed fictício em `supabase/seed.sql` (nunca dados reais).
- Após mudar o esquema: `npx supabase gen types typescript --local > src/types/database.ts`.
- Nuvem: `npx supabase link --project-ref <ref>`, conferir com `npx supabase migration list --linked` e aplicar com `npx supabase db push`. **Nunca** execute `db reset --linked`.

## Implantação (Vercel)

A aplicação está publicada no Vercel com domínio próprio. Para um novo ambiente:

1. Importar o repositório no Vercel (framework Next.js).
2. Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `INVITE_TTL_DAYS` (ex.: `7`)
   - `APP_URL` = URL pública (se omitida, usa `VERCEL_PROJECT_PRODUCTION_URL`/`VERCEL_URL`)
   - `SUPABASE_SERVICE_ROLE_KEY` **não** é necessária: a aplicação não a usa em execução.
3. No Supabase em nuvem:
   - confirmação de e-mail habilitada;
   - `APP_URL` e `APP_URL/auth/confirm` na allowlist de redirects;
   - SMTP próprio configurado (Resend);
   - senha mínima de 8 caracteres (Authentication → Providers → Email → Minimum password length), igual ao `config.toml` local;
   - migrações aplicadas no projeto correto;
   - primeiro gerente criado via `seed:manager`.

Rollback: redeploy de uma versão anterior no Vercel; no banco, migração corretiva (nunca reset).

## Segurança
- `SUPABASE_SERVICE_ROLE_KEY` é exclusiva de scripts de servidor: nunca `NEXT_PUBLIC_*`, nunca versionar, nunca logar.
- `src/lib/supabase/admin.ts` e `src/lib/env.server.ts` são protegidos com `server-only`.
- Detalhes em [`docs/architecture/SECURITY.md`](docs/architecture/SECURITY.md).
