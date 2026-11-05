# Estado da implementação — NPCP Academy

Documento vivo: atualizar ao concluir cada etapa. Serve para retomar o trabalho sem depender do histórico de conversa com o agente. Não contém segredos.

- **Atualizado em:** 2026-11-03.
- **Último commit de código:** `83ebd2d` (2026-10-18).
- **Fases concluídas:** 1 (fundação), 2 (identidade e convites) e 2b (contas e qualidade, implementada localmente; migração ainda não aplicada em produção). Ver `IMPLEMENTATION_PLAN.md`.

## Ambientes
| Item | Estado |
|---|---|
| Produção | Vercel com domínio próprio (D17) |
| Supabase | Projeto em nuvem `npcp-academy` (ref `vzkhvbygaodtrmhsputz`), região São Paulo |
| E-mail de Auth | SMTP Resend configurado; confirmação de e-mail ativa; redirects na allowlist |
| Primeiro gerente | Criado via `seed:manager` |
| Migrações | 7 no repositório. Na nuvem: as 6 primeiras (a 6ª confirmada pelo funcionamento de `/admin/users` em produção); **`20261103120000_account_management` pendente** — sem ela, Boas-vindas, Meu perfil e as ações de Usuários falham em produção |

## O que está implementado

### Rotas
| Rota | Descrição |
|---|---|
| `/` | Redireciona para `/dashboard` |
| `/login` | Login por e-mail/senha; consome convite pendente após login (fallback) |
| `/invite/[token]` | Mostra estado do convite; cadastro; se autenticado, consome o convite |
| `/auth/confirm` | Confirmação de e-mail e de recuperação de senha (PKCE `code` ou `token_hash`); `next` só aceita destinos da lista em `src/lib/auth/redirect.ts` |
| `/forgot-password` | Pedido de link de recuperação (resposta genérica) |
| `/reset-password` | Nova senha (sessão do link de recuperação ou usuário logado) |
| `/welcome` | Nome de exibição obrigatório no primeiro acesso |
| `/profile` | Meu perfil: editar nome, ver e-mail e papel, alterar senha |
| `/dashboard` | Boas-vindas e papel (conteúdo provisório) |
| `/admin/invitations` | Gerência cria (link copiável) e revoga convites |
| `/admin/users` | Gerência lista usuários, altera papel, desativa e reativa contas (com confirmação) |

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
| `20261103120000_account_management` | `account_events`, `set_display_name`, `get_my_account_status`, `change_user_role`, `set_user_disabled` |

### UI
Design system (tokens, fontes, componentes base, app shell responsivo, ícones Lucide, estados de página, diálogo de confirmação). Ver `docs/design/DESIGN_SYSTEM.md`.

Revisão de UI/UX em 2026-11-03: foco visível em superfícies escuras, bordas de campo e texto secundário com contraste AA, `<nav>` e link "pular para o conteúdo", sidebar fixa, títulos por página, mensagem de erro de confirmação no login, `loading`/`error`/`not-found`, confirmação ao revogar convite, botão de copiar link, mostrar/ocultar senha e datas nas listas administrativas.

## Testes
| Tipo | Conteúdo | Como rodar |
|---|---|---|
| Unitários/componente (Vitest) | 59 testes: papéis, token, navegação, contraste dos tokens, datas, componentes interativos, validação de nome e senha, mensagens de erro, redirecionamento seguro | `npm test` |
| Integração (Vitest + Supabase local) | 24 testes: alteração de papel (permitido/negado, próprio papel, conta não ativada, **concorrência entre dois gerentes**), desativação com sessão válida, reativação, histórico de eventos, nome de exibição, perfil alheio, RLS e consumo de convites (válido, reuso, e-mail divergente, expirado, em nome de outro) | `npm run test:integration` |
| Manual — e-mail | 9 verificações do convite com Mailpit | `node --env-file-if-exists=.env.development.local scripts/e2e-invite-email.mjs` |
| CI | Os dois primeiros, mais lint, typecheck e build, a cada push/PR | `.github/workflows/ci.yml` |

Última execução (2026-11-03, local): lint OK; typecheck OK; `npm test` 59/59; `npm run test:integration` 24/24 em 4 execuções seguidas; `e2e-invite-email` 9/9; `npm run build` OK; rotas públicas e redirecionamentos conferidos com o app rodando contra o Supabase local. **Não executados:** o workflow de CI no GitHub (roda no próximo push), o fluxo autenticado no navegador (Boas-vindas, Meu perfil, ações de Usuários) e a recuperação de senha com e-mail real.

### Cobertura de critérios de aceitação
| AC | Estado |
|---|---|
| AC-01, AC-02 | Integração (RLS + consumo) e script de e-mail |
| AC-03 | Implementado; redirecionamentos conferidos manualmente |
| AC-04 | Implementado; testes negativos de integração para convites, papéis e status |
| AC-41 | Implementado (`/welcome`); validação coberta por integração |
| AC-42, AC-43, AC-45 | Cobertos por integração |
| AC-44 | Coberto por integração (RLS com sessão válida); login informa conta desativada |
| AC-46 | Implementado; falta teste com e-mail real |
| AC-53 | Implementado na aplicação e no Supabase local; falta o painel da nuvem |
| AC-05 | Implementado (`server-only`, sem `NEXT_PUBLIC_` em segredos); sem verificação automatizada do bundle |
| AC-37 | Parcial (app shell responsivo; sem teste em navegador) |
| AC-38 | Parcial (estados vazio, carregando, erro e 404 existem; sem cobertura automatizada de página) |
| AC-40 | README atualizado |
| Demais | Não implementados |

## Lacunas conhecidas
1. Migração `20261103120000_account_management` não aplicada na nuvem (exige autorização).
2. Senha mínima de 8 no painel do Supabase em nuvem não ajustada.
3. Recuperação de senha depende do link ser aberto no mesmo navegador (PKCE); confirmar com e-mail real em produção.
4. Não há visualização do histórico `account_events` na interface (só no banco).
5. `seed.sql` vazio; seed fictício da trilha piloto pendente (Fase 3).
6. RLS de `profiles` só permite ler o próprio perfil (ou tudo, para gerência); fila e ranking exigirão leitura restrita de nomes (ver `DATA_MODEL.md`).

## Riscos
- **Desenvolvimento contra produção:** sem Supabase local rodando, `npm run dev` usa `.env.local`, que aponta para o projeto em nuvem de produção. Testes manuais e scripts podem criar dados reais. Mitigação: usar o Supabase local para desenvolvimento ou criar um projeto separado de dev.
- `SUPABASE_SERVICE_ROLE_KEY` não é usada pela aplicação em execução; se estiver configurada no Vercel, pode ser removida.
- Se a aplicação for publicada antes da migração, Boas-vindas falha para quem não tem nome e bloqueia o acesso dessas contas.
- Planos gratuitos: Supabase pode pausar por inatividade; limites de e-mail do Resend.

## Armadilhas operacionais
- Arquivos `.env*` devem ser UTF-8 **sem BOM**; BOM quebrou o Supabase CLI.
- Localmente, usar `http://127.0.0.1:3000`, não `localhost` (`site_url` e allowlist do Supabase local); `allowedDevOrigins` em `next.config.ts` já inclui `127.0.0.1`.
- Não rodar `next build` com `next dev` ativo.
- Nunca `db reset --linked`; `db push` só após `supabase link` com alvo confirmado.
- `cacheComponents`/PPR estão desativados (área autenticada dinâmica).
- Não usar o tipo gerado `LayoutProps<"/">` no layout raiz (quebra `typecheck` em clone limpo).
- Após mudar o esquema, regenerar `src/types/database.ts` (`npx supabase gen types typescript --local`). A versão local do gerador sai sem formatação e sem o bloco `__InternalSupabase`: formatar com `npx prettier@3.3.3 --no-semi --write src/types/database.ts` e manter o bloco.
- `next start` carrega `.env.local` (produção), não `.env.development.local`. Para testar localmente, use `npm run dev`.
- `next dev` insere um bloco de instruções do Next.js no fim do `AGENTS.md`.

## Histórico
| Data | Marco |
|---|---|
| 2026-10-15 | Especificação inicial e projeto Next.js |
| 2026-10-17 | Migrações base, auth e convites |
| 2026-10-18 | Confirmação PKCE, fallback local/nuvem, design system, lista de usuários, fallback de consumo no login |
| 2026-11-03 | Deploy no Vercel com domínio e Resend; revisão da documentação e registro de decisões D17–D34 |
| 2026-11-03 | Revisão de UI/UX (acessibilidade, estados de página, confirmação de ações) |
| 2026-11-03 | Fase 2b local: nome obrigatório, Meu perfil, recuperação de senha, gestão de papéis/status, senha mínima 8, suíte de integração e CI; decisões D35–D37 |
