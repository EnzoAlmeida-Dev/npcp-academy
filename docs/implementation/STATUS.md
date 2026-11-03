# Estado da implementação — NPCP Academy

Documento vivo: atualizar ao concluir cada etapa. Serve para retomar o trabalho sem depender do histórico de conversa com o agente. Não contém segredos.

- **Atualizado em:** 2026-11-03.
- **Último commit de código:** `83ebd2d` (2026-10-18).
- **Fases concluídas:** 1 (fundação) e 2 (identidade e convites). Ver `IMPLEMENTATION_PLAN.md`.

## Ambientes
| Item | Estado |
|---|---|
| Produção | Vercel com domínio próprio (D17) |
| Supabase | Projeto em nuvem `npcp-academy` (ref `vzkhvbygaodtrmhsputz`), região São Paulo |
| E-mail de Auth | SMTP Resend configurado; confirmação de e-mail ativa; redirects na allowlist |
| Primeiro gerente | Criado via `seed:manager` |
| Migrações | 6 no repositório. O último registro confirmou 5/5 na nuvem, antes de `20261018090000_admin_list_users`; **confirmar** com `npx supabase migration list --linked` |

## O que está implementado

### Rotas
| Rota | Descrição |
|---|---|
| `/` | Redireciona para `/dashboard` |
| `/login` | Login por e-mail/senha; consome convite pendente após login (fallback) |
| `/invite/[token]` | Mostra estado do convite; cadastro; se autenticado, consome o convite |
| `/auth/confirm` | Confirmação de e-mail (PKCE `code` ou `token_hash`) e redireciona ao convite |
| `/dashboard` | Boas-vindas e papel (conteúdo provisório) |
| `/admin/invitations` | Gerência cria (link copiável) e revoga convites |
| `/admin/users` | Gerência lista usuários e status (somente leitura) |

Menu por papel em `src/lib/navigation.ts`; Trilhas, Competências e Revisões aparecem como "em breve".

### Banco
Ver seção "Implementado" de `docs/architecture/DATA_MODEL.md`.

| Migração | Conteúdo |
|---|---|
| `20261017190000_profiles_invitations` | Enum de papéis, `profiles`, `invitations`, triggers |
| `20261017190100_functions` | Funções de autorização, `consume_invitation`, `revoke_invitation` |
| `20261017190200_rls_policies` | RLS e grants |
| `20261017190300_get_invitation_info` | RPC pública de estado do convite |
| `20261017200000_fix_invitations_used_consistency` | CHECK de uso compatível com exclusão de usuário |
| `20261018090000_admin_list_users` | RPC `list_users_for_admin` |

### UI
Design system (tokens, fontes, componentes base, app shell responsivo, ícones Lucide, estados de página, diálogo de confirmação). Ver `docs/design/DESIGN_SYSTEM.md`.

Revisão de UI/UX em 2026-11-03: foco visível em superfícies escuras, bordas de campo e texto secundário com contraste AA, `<nav>` e link "pular para o conteúdo", sidebar fixa, títulos por página, mensagem de erro de confirmação no login, `loading`/`error`/`not-found`, confirmação ao revogar convite, botão de copiar link, mostrar/ocultar senha e datas nas listas administrativas. Fora do escopo desta revisão (dependem da Fase 2b): nome de exibição obrigatório (D28), "Esqueci a senha" (D8) e ações em `/admin/users`.

## Testes
| Tipo | Conteúdo | Como rodar |
|---|---|---|
| Unitários/componente (Vitest) | 43 testes: smoke node/jsdom, hierarquia de papéis, token de convite, navegação por papel, contraste dos tokens, formatação de data, `ConfirmDialog`, `PasswordInput`, `CopyButton` | `npm test` |
| E2E manual — RLS e convite | 6 verificações: RLS de convite, consumo válido, reuso rejeitado, member bloqueado, e-mail divergente | `node --env-file-if-exists=.env.development.local scripts/e2e-smoke.mjs` (Supabase local) |
| E2E manual — e-mail | 9 verificações: cadastro exige confirmação, e-mail no Mailpit, confirmação, consumo, ativação | `scripts/e2e-invite-email.mjs` (Supabase local) |

Última execução registrada: lint, typecheck, `npm test` (43/43) e `npm run build` OK em 2026-11-03; verificação em execução (`/login`, `/login?error=confirm`, 404, redirecionamento sem sessão) OK. Scripts E2E: 2026-10-18. Telas autenticadas não foram inspecionadas em navegador nesta revisão.

### Cobertura de critérios de aceitação
| AC | Estado |
|---|---|
| AC-01, AC-02 | Coberto por scripts E2E manuais |
| AC-03 | Implementado (app shell redireciona sem perfil ativo); sem teste automatizado |
| AC-04 | Implementado para convites e usuários (servidor + RLS); teste negativo de RLS só no script E2E |
| AC-05 | Implementado (`server-only`, sem `NEXT_PUBLIC_` em segredos); sem verificação automatizada do bundle |
| AC-37 | Parcial (app shell responsivo; sem teste em navegador) |
| AC-38 | Parcial (estados vazio, carregando, erro e 404 existem; sem cobertura automatizada de página) |
| AC-40 | README atualizado |
| Demais | Não implementados |

## Lacunas conhecidas
1. Nome de exibição é opcional no cadastro e não há etapa obrigatória após ativação (D28).
2. Sem UI de recuperação de senha (D8), embora o SMTP já esteja configurado.
3. `/admin/users` é somente leitura: falta alterar papel, desativar e reativar (D9, D21, D29).
4. Testes de RLS e concorrência existem só como scripts manuais contra o Supabase local; não há suíte de integração no `npm test` nem CI.
5. Senha mínima de 6 caracteres (`supabase/config.toml` e validação do cadastro) — revisar.
6. `seed.sql` vazio; seed fictício da trilha piloto pendente (Fase 3).
7. RLS de `profiles` só permite ler o próprio perfil (ou tudo, para gerência); fila e ranking exigirão leitura restrita de nomes (ver `DATA_MODEL.md`).

## Riscos
- **Desenvolvimento contra produção:** sem Supabase local rodando, `npm run dev` usa `.env.local`, que aponta para o projeto em nuvem de produção. Testes manuais e scripts podem criar dados reais. Mitigação: usar o Supabase local para desenvolvimento ou criar um projeto separado de dev.
- `SUPABASE_SERVICE_ROLE_KEY` não é usada pela aplicação em execução; se estiver configurada no Vercel, pode ser removida.
- Planos gratuitos: Supabase pode pausar por inatividade; limites de e-mail do Resend.

## Armadilhas operacionais
- Arquivos `.env*` devem ser UTF-8 **sem BOM**; BOM quebrou o Supabase CLI.
- Localmente, usar `http://127.0.0.1:3000`, não `localhost` (`site_url` e allowlist do Supabase local); `allowedDevOrigins` em `next.config.ts` já inclui `127.0.0.1`.
- Não rodar `next build` com `next dev` ativo.
- Nunca `db reset --linked`; `db push` só após `supabase link` com alvo confirmado.
- `cacheComponents`/PPR estão desativados (área autenticada dinâmica).
- Não usar o tipo gerado `LayoutProps<"/">` no layout raiz (quebra `typecheck` em clone limpo).
- Após mudar o esquema, regenerar `src/types/database.ts` (`npx supabase gen types typescript --local`).

## Histórico
| Data | Marco |
|---|---|
| 2026-10-15 | Especificação inicial e projeto Next.js |
| 2026-10-17 | Migrações base, auth e convites |
| 2026-10-18 | Confirmação PKCE, fallback local/nuvem, design system, lista de usuários, fallback de consumo no login |
| 2026-11-03 | Deploy no Vercel com domínio e Resend; revisão da documentação e registro de decisões D17–D34 |
