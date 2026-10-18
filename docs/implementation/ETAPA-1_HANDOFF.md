# Handoff — Etapa 1 (Fundação + Identidade e Convites)

- **Status:** implementada e validada em ambiente local.
- **Data:** 2026-10-18.
- **Local do projeto:** `C:\dev\npcp-academy` (fora do OneDrive).
- **Finalidade:** registro de decisões e mudanças para retomada segura caso
  a janela de contexto da conversa com o agente seja perdida. Este documento
  deve ser lido junto de `AGENTS.md` e dos documentos em `docs/`.

> Documento de continuidade (AI-assisted development). Não contém segredos:
> valores de `.env` nunca são versionados. Nenhuma credencial real é usada.

---

## 0. Atualização pós-deploy (nuvem)

- Projeto Supabase em nuvem linkado: `vzkhvbygaodtrmhsputz` (`npcp-academy`, São Paulo).
- Migrações aplicadas na nuvem: **5/5** (`migration list --linked` confere).
- Ambiente em modo **cloud-only**: `.env.development.local.disabled`; `.env.local`
  com URL, publishable key, service-role, `APP_URL` e `INVITE_TTL_DAYS`.
- Primeiro manager criado via `seed:manager` (idempotente); conta confirmada e
  perfil `manager` ativado.
- Confirmação de e-mail habilitada e redirect URLs configuradas no dashboard.
- **Pendente:** configurar SMTP próprio e validar o fluxo de convite com e-mail real.
- `scripts/seed-manager.mjs` passou a criar a conta de auth quando ela não existe,
  usando `MANAGER_PASSWORD` temporária (nunca impressa).

---

## 1. Resumo executivo

A Etapa 1 entregou a fundação do projeto e a fatia vertical de identidade e
convites:

- Autenticação por e-mail/senha (Supabase Auth) com **confirmação de e-mail ativa**.
- Convites de uso único, com token armazenado apenas como hash, expiração
  configurável (7 dias), revogação e controle de papel.
- Ativação de conta somente após confirmação de e-mail e consumo transacional
  do convite.
- Papéis `member` / `reviewer` / `manager` com hierarquia explícita no servidor
  e no RLS.
- Contas desativadas/inativas bloqueadas.
- Migrações SQL versionadas, testes (Vitest) e scripts de bootstrap/verificação.

Submissões/revisões, competências, XP, níveis e ranking estão **especificados**,
mas **não implementados** (regras pendentes).

---

## 2. Stack e dependências

- Next.js `16.4.1` (App Router, Turbopack) + React `19.3.0` + TypeScript.
- Tailwind CSS v4 (via `@tailwindcss/turbopack`).
- Supabase local (Docker) + `@supabase/ssr` `0.12.7` + `@supabase/supabase-js` `2.118.0`.
- Validação: `zod` `^4.6.7`.
- Proteção de módulo de servidor: `server-only`.
- Testes: `vitest` `^4.1.12`, `@vitejs/plugin-react` `^5.2.0`, `jsdom` `^30.1.3`,
  `@testing-library/react`, `@testing-library/dom`, `@testing-library/jest-dom`.
- Ferramenta: Supabase CLI `^2.121.0` (devDependency).

Scripts (`package.json`):
`dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:watch`, `seed:manager`.

---

## 3. Decisões

| ID | Decisão | Status |
|---|---|---|
| D1 | Papéis fixos `member` < `reviewer` < `manager`, hierarquia no servidor **e** RLS | **Implementado** |
| D2 | `user_competencies` (estado) + `competency_evidence` (histórico) | Especificado (não implementado) |
| D3 | `submissions` fonte de verdade; `reviews` imutável; sem duplicar estados em `activity_progress` | Especificado (não implementado) |
| D4 | Reenvio cria nova versão; histórico preservado | Especificado (não implementado) |
| D5 | Convite carrega `role`; só gerência concede papel privilegiado | **Implementado** |
| D6 | Bootstrap do 1º manager via procedimento controlado | **Implementado** |
| D7 | Convite por link copiável (sem e-mail automático de convite) | **Implementado** |
| D8 | Recuperação de conta nativa do Supabase (e-mail) | Pendente (UI/SMTP) |
| D9 | Usuário desativado bloqueado (RLS + servidor) | **Implementado** |
| A | Confirmação de e-mail **ativa** (token do convite ≠ confirmação) | **Implementado** |
| — | Expiração inicial de convite: 7 dias (`INVITE_TTL_DAYS`) | **Implementado** |
| — | Saldo de XP por `SUM(xp_transactions)` | Decidido (não implementado) |

### Pendências de negócio (não inventar)
- **D10–D16:** regras de competência, XP, níveis e ranking.
- **D19:** SLA de revisão e reatribuição.
- **D17/D18/D20/D21:** hospedagem/região, privacidade/retenção, visibilidade do
  ranking e manutenção pós-candidatura.

---

## 4. Banco de dados (migrações)

Ordem em `supabase/migrations/`:

| Arquivo | Conteúdo |
|---|---|
| `20261017190000_profiles_invitations.sql` | enum `user_role`; `profiles` (`role`, `activated_at`, `disabled_at`); `invitations` (`email_normalized`, `token_hash` único, `role`, `expires_at`, `used_at`, `used_by`, `revoked_at`, `created_by`); constraints/índices; trigger `handle_new_user` (perfil inativo); trigger `updated_at` |
| `20261017190100_functions.sql` | `role_rank`, `current_profile_role`, `has_role_at_least`, `is_user_active`, `consume_invitation` (transacional/`FOR UPDATE`/idempotente), `revoke_invitation` |
| `20261017190200_rls_policies.sql` | RLS em `profiles`/`invitations`; policies de leitura própria/gerência e criação de convite por gerência; grants |
| `20261017190300_get_invitation_info.sql` | RPC para resolver e-mail/status do convite pelo hash do token (anon/authenticated) |
| `20261017200000_fix_invitations_used_consistency.sql` | corrige o CHECK de uso do convite para permitir exclusão de usuário (`used_at` pode permanecer sem `used_by`) |

### Funções (Security Definer)
`role_rank`, `current_profile_role`, `has_role_at_least`, `is_user_active`,
`consume_invitation`, `revoke_invitation`, `get_invitation_info`,
`handle_new_user`, `set_updated_at`.

### RLS
- `profiles_select_self_or_manager`: usuário ativo vê o próprio perfil; gerência vê todos.
- `invitations_select_manager` / `invitations_insert_manager`: apenas gerência ativa;
  criação exige `created_by = auth.uid()`.
- Usuários inativos/desativados são negados por `is_user_active`.

### Consumo de convite (regras)
`consume_invitation(p_token_hash, p_user_id)` só ativa se:
1. `p_user_id = auth.uid()` (sessão autenticada);
2. token ativo (não usado/revogado/expirado) — lock `FOR UPDATE` garante concorrência;
3. e-mail normalizado da conta == e-mail do convite;
4. `email_confirmed_at` preenchido.
Então marca `used_at/used_by` e define `role` + `activated_at`.
Idempotente apenas para o mesmo usuário que já consumiu.

---

## 5. Estrutura da aplicação

```
src/
  proxy.ts                         # refresh de sessão (getClaims) + headers no-store
  app/
    layout.tsx                     # layout raiz (pt-BR)
    page.tsx                       # redireciona para /dashboard
    (auth)/login/page.tsx          # login
    (auth)/invite/[token]/page.tsx # aceite/consumo de convite
    auth/confirm/route.ts          # confirma e-mail (PKCE code / token_hash)
    (app)/layout.tsx               # área protegida (exige perfil ativo)
    (app)/dashboard/page.tsx
    (app)/admin/invitations/page.tsx
  features/
    auth/{actions.ts,login-form.tsx}
    invitations/{actions,queries,info,token,token.test,create-invitation-form,invite-accept-form,revoke-invitation-button}
  lib/
    env.ts, env.server.ts          # validação de ambiente (zod)
    action-state.ts
    auth/{roles,roles.test,session,authorize}.ts
    supabase/{client,server,admin}.ts
  types/database.ts                # gerado por `supabase gen types`
supabase/{config.toml,seed.sql,migrations/*}
scripts/{seed-manager,seed-local-test-accounts,e2e-smoke,e2e-invite-email}.mjs
docs/design/{DESIGN_SYSTEM,WIREFRAMES,NAVIGATION_FLOWS,UX_ACCEPTANCE}.md
```

### Segurança de módulos
- `src/lib/supabase/admin.ts` importa `server-only` (service-role nunca no cliente).
- `src/lib/env.server.ts` também é `server-only`.
- Nenhum segredo usa prefixo `NEXT_PUBLIC_`.

---

## 6. Fluxos implementados

### Login/logout
`POST` server action → `signInWithPassword` → `/dashboard`. Logout via server action.

### Convite
1. Gerência cria convite (e-mail + papel) em `/admin/invitations`.
2. Sistema gera token aleatório (32 bytes) e grava **apenas** o SHA-256.
3. Link `/invite/<token>` exibe o e-mail convidado (somente leitura).
4. `signUp` com o e-mail do convite; Supabase envia confirmação de e-mail.
5. Usuário confirma pelo link; o GoTrue redireciona para `/auth/confirm?code=...` (PKCE).
6. `/auth/confirm` troca o `code` por sessão, define cookies e redireciona para
   `/invite/<token>` (token vindo de `user_metadata.invite_token`).
7. A página do convite, já autenticada, chama `consume_invitation` e vai ao dashboard.
8. Fallback: reabrir o link do convite logado também conclui o consumo.

---

## 7. Correções/incidentes durante validação

1. `.env.development.local` gravado com **BOM** e valores vazios → quebrava o CLI
   Supabase e sobrescrevia `.env.local`; regravado em UTF-8 sem BOM.
2. `allowedDevOrigins: ["127.0.0.1"]` em `next.config.ts` (HMR bloqueado por origem).
3. `cacheComponents`/`partialPrefetching` desativados (MVP autenticado; PPR exigiria
   Suspense/`use cache`).
4. `src/app/layout.tsx`: tipo gerado `LayoutProps<"/">` quebrava `typecheck` em clone
   limpo; trocado por `{ children: ReactNode }`.
5. `supabase/config.toml`: `enable_confirmations = false` → **`true`** (decisão A).
6. Constraint `invitations_used_consistency` impedia deletar usuário; corrigida na
   migração `20261017200000`.
7. `/auth/confirm` não tratava o `code` (PKCE) real do GoTrue; adicionado
   `exchangeCodeForSession`, mantendo suporte a `token_hash`/`type`.
8. `scripts/e2e-smoke.mjs` tornou-se idempotente (tokens únicos + limpeza).

---

## 8. Testes e validações executados

- `npm run lint` — OK.
- `npm run typecheck` — OK.
- `npm test` — **10/10** (smoke node/jsdom + hierarquia de papéis + token).
- `npm run build` — OK (rotas autenticadas dinâmicas).
- `scripts/e2e-smoke.mjs` — **6/6** (RLS de convite, consumo válido, reuso
  rejeitado, RLS bloqueia member, e-mail divergente).
- `scripts/e2e-invite-email.mjs` — **9/9** (signUp exige confirmação, e-mail no
  Mailpit, confirmação, consumo, ativação).
- Fluxo "navegador" (cookies reais + `/auth/confirm` com `code`) — **7/7**
  (executado de forma ad-hoc; script removido).
- `GET /login` → 200; `GET /` → 307.

---

## 9. Runbook local

```powershell
cd C:\dev\npcp-academy
npm install
npx supabase start
# configurar .env.development.local a partir de `npx supabase status` (sem versionar):
#   NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
#   SUPABASE_SERVICE_ROLE_KEY, INVITE_TTL_DAYS=7, APP_URL=http://127.0.0.1:3000
npx supabase migration up
npm run dev        # http://127.0.0.1:3000
```

- Studio: `http://127.0.0.1:55424` · Mailpit: `http://127.0.0.1:55425`.
- Contas de teste locais (recriar): `node --env-file-if-exists=.env.development.local scripts/seed-local-test-accounts.mjs`.
- Bootstrap do 1º gerente (após existir o usuário de auth):
  `npm run seed:manager -- --email=<email> --confirm`.
- Verificações: `scripts/e2e-smoke.mjs` e `scripts/e2e-invite-email.mjs`.

> Use sempre `127.0.0.1:3000` (não `localhost`), pois `site_url`/allowlist do
> Supabase local é `http://127.0.0.1:3000`.

---

## 9.1 Ambientes, fallback e Vercel

- `.env.local` = alvo ativo (nuvem ou local); `.env.development.local` = override
  local opcional do Supabase Docker.
- `npm run dev` usa `scripts/dev.mjs`: se o Supabase **local** responder, usa o
  override local; caso contrário, **pré-carrega `.env.local`** (nuvem). O
  `@next/env` não sobrescreve `process.env`, então a nuvem prevalece no fallback.
  Isso evita quebrar o dev quando o Docker não está rodando.
- `npm run check:supabase` (`scripts/check-supabase.mjs`) mostra alvo e
  conectividade de cada ambiente sem expor valores.
- `src/lib/env.server.ts` foi refatorado:
  - `getAppServerEnv()` → `APP_URL` + `INVITE_TTL_DAYS` (sem service-role);
  - `getServiceRoleKey()` → exigida apenas pelo bootstrap/admin.
  O fluxo de convites não depende mais da service-role.
- `APP_URL` no Vercel: se não definido, usa `VERCEL_PROJECT_PRODUCTION_URL`
  (ou `VERCEL_URL`) automaticamente.
- `package.json` declara `engines.node >= 22` (compatível com Vercel).
- **Vercel (Hobby/gratuito):** não usa Docker nem CLI em runtime. Configurar as
  variáveis no painel; no Supabase em nuvem, habilitar confirmação de e-mail,
  allowlist de redirects, aplicar migrações e configurar SMTP (o serviço padrão
  tem limite baixo).

## 10. Regras de segurança preservadas

- `SUPABASE_SERVICE_ROLE_KEY` só no ambiente de servidor; nunca `NEXT_PUBLIC_`,
  nunca versionada, nunca logada.
- `server-only` em `admin.ts` e `env.server.ts`.
- Autorização no servidor **e** RLS; a UI não é controle de segurança.
- Contas com `activated_at` nulo ou `disabled_at` preenchido são negadas.
- Tokens de convite: uso único, hash no banco, expiração/revogação, mensagens genéricas.
- Não ler/imprimir/copiar `.env`, `.env.local` ou arquivos de credenciais.

---

## 11. Limitações e pendências

- Submissões/revisões, competências, XP/níveis/ranking: **não implementados**
  (D10–D16, D19).
- Recuperação de conta (D8): não há UI; depende de SMTP configurado.
- Administração de usuários além de convites: não implementada.
- Testes de RLS/concorrência existem como scripts E2E manuais, não suíte formal.
- `.env.local` (nuvem) está presente no projeto novo. Se a pasta antiga do OneDrive
  ainda existir, pode ser removida manualmente após conferir que `.env.local` foi
  movido/recriado.
- O `npm run dev` seleciona automaticamente local ou nuvem (ver seção 9.1).

---

## 12. Riscos

- Antes de publicar: habilitar confirmação de e-mail e configurar SMTP + allowlist
  de URLs no projeto Supabase de produção; definir região/privacidade (D17/D18).
- Não rodar `next build` simultaneamente ao `next dev`.
- Evitar `db push`/`db reset` remotos sem identificar e confirmar o alvo;
  nunca `db reset --linked`.
- Latência de dev era agravada pelo OneDrive; agora o projeto está em `C:\dev`.

---

## 13. Próximos passos sugeridos

1. Commitar as correções pendentes (ver seção 14).
2. Mover/recriar `.env.local` e remover a pasta antiga do OneDrive.
3. Validar manualmente o fluxo no navegador (opcional; já coberto por E2E).
4. Resolver as pendências de negócio D10–D21 antes de implementar as próximas fases.
5. Implementar Fase 5 (submissões/revisões) só após D3/D4/D10–D12 definidos.

---

## 14. Estado do Git no momento deste registro

```
 M .env.example
 M README.md
 M package.json
 M scripts/e2e-smoke.mjs
 M scripts/seed-manager.mjs
 M src/app/auth/confirm/route.ts
 M src/app/layout.tsx
 M src/features/invitations/actions.ts
 M src/lib/env.server.ts
 M src/lib/supabase/admin.ts
 M supabase/config.toml
?? docs/implementation/ETAPA-1_HANDOFF.md
?? scripts/check-supabase.mjs
?? scripts/dev.mjs
?? scripts/e2e-invite-email.mjs
?? supabase/migrations/20261017200000_fix_invitations_used_consistency.sql
```

Commits existentes: `68931ce init: first codebase prototype`,
`03899b6 chore: initialize Next.js project`.

> Nota: a seleção de ambiente (`scripts/dev.mjs`), o diagnóstico
> (`scripts/check-supabase.mjs`) e a refatoração de `env.server.ts` foram
> adicionados depois da mudança para `C:\dev` e ainda não estão commitados.

---

## 15. Changelog resumido (ordem de execução)

1. Leitura e análise dos documentos (PRD, AC, fluxos, arquitetura, segurança, plano).
2. Definição de D1–D9 e da decisão A (confirmação de e-mail).
3. Instalação de dependências e configuração de qualidade (Vitest).
4. Migrações base, RLS, funções e RPC de convite.
5. Clientes Supabase, env, proxy e tipos gerados.
6. Auth, convites, páginas e formulários.
7. Scripts de bootstrap e E2E.
8. Documentação UX/UI e README.
9. Mudança do projeto para `C:\dev` e validação completa.
10. Correções de schema e do fluxo PKCE/`code`.
