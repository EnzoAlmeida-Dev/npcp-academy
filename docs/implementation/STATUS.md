# Estado da implementação — NPCP Academy

Documento vivo: atualizar ao concluir cada etapa. Serve para retomar o trabalho sem depender do histórico de conversa com o agente. Não contém segredos.

- **Atualizado em:** 2026-11-05.
- **Em andamento:** Fase 3 (conteúdo e trilhas). Etapa 3a (vínculo) pronta e verificada localmente; migração `20261119120000_membership` ainda **não aplicada na nuvem**. Próxima: 3b (esquema de conteúdo).
- **Fases concluídas:** 1 (fundação), 2 (identidade e convites) e 2b (contas e qualidade, em produção). Ver `IMPLEMENTATION_PLAN.md`.

## Ambientes
| Item | Estado |
|---|---|
| Produção | Vercel com domínio próprio (D17) |
| Supabase | Projeto em nuvem `npcp-academy` (ref `vzkhvbygaodtrmhsputz`), região São Paulo |
| E-mail de Auth | SMTP Resend configurado; confirmação de e-mail ativa; redirects na allowlist |
| Primeiro gerente | Criado via `seed:manager` |
| Migrações | 7 no repositório, todas aplicadas na nuvem. A 7ª foi aplicada pelo SQL Editor e registrada em `schema_migrations`, porque a rede local bloqueia a porta do Postgres (`db push` trava) |

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
| `/admin/users` | Gerência lista usuários, altera papel e vínculo (efetivação), desativa e reativa contas (com confirmação) |

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
| `20261119120000_membership` | Vínculo trainee/efetivado em perfis e convites, `set_user_membership`, consumo de convite e lista de usuários com vínculo |

### UI
Design system (base neutra, cor com função, progresso em chevrons, superfícies em camadas, ícones Lucide, estados de página, diálogo de confirmação). Ver `docs/design/DESIGN_SYSTEM.md`. O dashboard mostra só dados reais: primeiros passos para todos e, para a gerência, contas por status e papel e convites em aberto.

Revisão de UI/UX em 2026-11-03: foco visível em superfícies escuras, bordas de campo e texto secundário com contraste AA, `<nav>` e link "pular para o conteúdo", sidebar fixa, títulos por página, mensagem de erro de confirmação no login, `loading`/`error`/`not-found`, confirmação ao revogar convite, botão de copiar link, mostrar/ocultar senha e datas nas listas administrativas.

## Testes
| Tipo | Conteúdo | Como rodar |
|---|---|---|
| Unitários/componente (Vitest) | 83 testes: identidade visual (manifest e arquivos da marca), papéis, token, navegação, contraste dos tokens, datas, componentes interativos, progresso em chevrons, resumo do dashboard, validação de nome e senha, mensagens de erro, redirecionamento seguro | `npm test` |
| Integração (Vitest + Supabase local) | 24 testes: alteração de papel (permitido/negado, próprio papel, conta não ativada, **concorrência entre dois gerentes**), desativação com sessão válida, reativação, histórico de eventos, nome de exibição, perfil alheio, RLS e consumo de convites (válido, reuso, e-mail divergente, expirado, em nome de outro) | `npm run test:integration` |
| Manual — e-mail | 9 verificações do convite com Mailpit | `node --env-file-if-exists=.env.development.local scripts/e2e-invite-email.mjs` |
| CI | Os dois primeiros, mais lint, typecheck e build, a cada push/PR | `.github/workflows/ci.yml` |

Última execução (2026-11-05, local): lint OK; typecheck OK; `npm test` 77/77; `npm run test:integration` 24/24; `npm run build` OK. O CI do GitHub passou no push da Fase 2b. Telas autenticadas conferidas em Chrome real contra o Supabase local no redesign (2026-11-05), em desktop e celular. **Não executado:** recuperação de senha com e-mail real em produção.

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
1. Confirmar a senha mínima de 8 no painel do Supabase em nuvem.
2. Recuperação de senha depende do link ser aberto no mesmo navegador (PKCE); confirmar com e-mail real em produção.
3. Não há visualização do histórico `account_events` na interface (só no banco).
4. `seed.sql` vazio; seed fictício da trilha piloto pendente (Fase 3).
5. RLS de `profiles` só permite ler o próprio perfil (ou tudo, para gerência); fila e ranking exigirão leitura restrita de nomes (ver `DATA_MODEL.md`).

## Riscos
- **Next.js 16.4.1 com vulnerabilidade conhecida (2026-11-20):** o `npm audit` aponta 7 avisos de severidade moderada (versões 16.0.0 a 16.4.4; correção em 16.4.6, que está fora da faixa fixada em `package.json`). Os avisos citam `use cache`, otimização de imagem com SVG, rotas Edge e aplicações autohospedadas; a aplicação não usa `use cache` nem rotas Edge, mas a exposição não foi avaliada em detalhe. Além disso, o `next build` e o `next dev` agora **param com erro (`SecurityFatalError`) em execuções alternadas** para mostrar a recomendação de upgrade; um ambiente limpo (CI, Vercel) pode falhar na primeira execução. Decidir o upgrade antes do próximo push.
- **Desenvolvimento contra produção:** sem Supabase local rodando, `npm run dev` usa `.env.local`, que aponta para o projeto em nuvem de produção. Testes manuais e scripts podem criar dados reais. Mitigação: usar o Supabase local para desenvolvimento ou criar um projeto separado de dev.
- `SUPABASE_SERVICE_ROLE_KEY` não é usada pela aplicação em execução; se estiver configurada no Vercel, pode ser removida.
- Migração sempre antes do push na `main`: o Vercel publica a `main`, e código que depende de função ainda inexistente na nuvem quebra em produção.
- Planos gratuitos: Supabase pode pausar por inatividade; limites de e-mail do Resend.

## Armadilhas operacionais
- Arquivos `.env*` devem ser UTF-8 **sem BOM**; BOM quebrou o Supabase CLI.
- Localmente, usar `http://127.0.0.1:3000`, não `localhost` (`site_url` e allowlist do Supabase local); `allowedDevOrigins` em `next.config.ts` já inclui `127.0.0.1`.
- Não rodar `next build` com `next dev` ativo.
- Nunca `db reset --linked`; `db push` só após `supabase link` com alvo confirmado.
- `cacheComponents`/PPR estão desativados (área autenticada dinâmica).
- Não usar o tipo gerado `LayoutProps<"/">` no layout raiz (quebra `typecheck` em clone limpo).
- Após mudar o esquema, regenerar `src/types/database.ts` (`npx supabase gen types typescript --local`). A versão local do gerador sai sem formatação e sem o bloco `__InternalSupabase`: formatar com `npx prettier@3.3.3 --no-semi --write src/types/database.ts` e manter o bloco.
- Rode os testes a partir de `C:\dev\npcp-academy` (drive em maiúscula). Com o terminal em `c:\...`, o Vitest carrega o `setup.ts` duas vezes e todos os arquivos falham com "failed to find the current suite".
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
| 2026-11-05 | Fase 2b em produção: nome obrigatório, Meu perfil, recuperação de senha, gestão de papéis/status, senha mínima 8, suíte de integração e CI; decisões D35–D37 |
| 2026-11-05 | Redesign Modern Learning SaaS em todas as telas |
| 2026-11-15 | Logo oficial, favicon, ícones Apple/Android e manifest |
| 2026-11-18 | Especificação de trilhas, blocos, vínculo trainee/efetivado, XP e títulos (`LEARNING_PATHS.md`, D38–D45) |
| 2026-11-19 | Decididos: blocos livres, prazos no CRUD, XP ×10, níveis por fórmula (limites pela metade, 125 × n × (n − 1)); termos e privacidade em fase de testes (`TERMS_AND_PRIVACY.md`); finalidade dos dados (D47) e métricas de acompanhamento dos membros (D48, RB-09); eventos de trilha (D49); prazos no evento (D50) |
