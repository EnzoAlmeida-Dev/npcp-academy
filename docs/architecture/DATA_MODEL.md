# Modelo de dados — NPCP Academy

Referências `Dnn` apontam para `docs/product/DECISIONS.md`. A seção "Implementado" reflete as migrações em `supabase/migrations/`; em caso de divergência, a migração prevalece e este documento deve ser corrigido. A seção "Planejado" é conceitual: nomes e tipos finais são fixados na migração da fase correspondente.

## Implementado

### `membership` (enum)
`trainee`, `efetivado` — vínculo da pessoa, independente do papel (D44).

### `user_role` (enum)
`member`, `reviewer`, `manager` — hierarquia via `role_rank()` (D1).

### `profiles`
| Coluna | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | = `auth.users.id`, `on delete cascade` |
| `display_name` | text null | Obrigatório pela aplicação antes do uso (D28); nulo até ser definido |
| `role` | `user_role` | default `member`; definido pelo convite |
| `membership` | `membership` | default `trainee`; definido pelo convite e alterado só pela gerência (D44). Contas anteriores a 2026-11-19 viraram `efetivado` |
| `activated_at` | timestamptz null | Preenchido ao consumir o convite |
| `disabled_at` | timestamptz null | Conta desativada quando preenchido (D9) |
| `created_at`, `updated_at` | timestamptz | `updated_at` por trigger |

- Criado inativo pelo trigger `handle_new_user` no cadastro em `auth.users`.
- Usuário é **ativo** quando `activated_at is not null and disabled_at is null`.
- Não armazena senha nem segredos. O e-mail fica apenas em `auth.users`.

### `invitations`
| Coluna | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `email_normalized` | text | CHECK: minúsculo e sem espaços |
| `token_hash` | text unique | SHA-256 do token; o token bruto não é armazenado |
| `role` | `user_role` | Papel concedido no consumo (D5) |
| `membership` | `membership` | Vínculo concedido no consumo (D44); default `trainee` |
| `expires_at` | timestamptz | CHECK: posterior a `created_at` |
| `used_at`, `used_by` | timestamptz, uuid → profiles | CHECK: `used_by` exige `used_at` (`used_by` vira nulo se o usuário for excluído) |
| `revoked_at` | timestamptz null | |
| `created_by` | uuid → profiles | |
| `created_at` | timestamptz | |

Índices: e-mail de convites ativos; `created_by`.

### Funções (todas `security definer`, `search_path = ''`)
| Função | Uso |
|---|---|
| `role_rank`, `current_profile_role`, `has_role_at_least`, `is_user_active` | Autorização em RLS e RPCs; usuários inativos têm papel nulo |
| `consume_invitation(token_hash, user_id)` | Consumo atômico (`FOR UPDATE`), exige `user_id = auth.uid()`, e-mail igual e confirmado; idempotente só para o mesmo usuário |
| `revoke_invitation(id)` | Gerência; só convites não usados |
| `get_invitation_info(token_hash)` | `anon`/`authenticated`; e-mail, papel e estado do convite |
| `list_users_for_admin()` | Gerência; perfis (com papel e vínculo) + e-mail de `auth.users` |
| `set_display_name(name)` | Próprio usuário ativo (`auth.uid()`); 2–60 caracteres, sem espaços nas pontas (D28) |
| `get_my_account_status()` | Próprio usuário, inclusive inativo/desativado: `activated`, `disabled` |
| `change_user_role(user_id, role)` | Gerência; não altera o próprio papel nem conta não ativada; protege o último gerente (D29); registra evento |
| `set_user_disabled(user_id, disabled)` | Gerência; não altera a própria conta; protege o último gerente; registra evento (D9) |
| `set_user_membership(user_id, membership)` | Gerência; não altera o próprio vínculo nem conta não ativada; registra evento `membership_changed` (D44) |
| `lock_managers_and_authorize()`, `other_active_managers(id)` | Internas: bloqueiam as linhas de gerentes e revalidam o chamador, para que operações concorrentes não deixem o sistema sem gerente |
| `handle_new_user`, `set_updated_at` | Triggers |

### `account_events`
| Coluna | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid → profiles | `on delete cascade` |
| `event_type` | text | CHECK: `role_changed`, `disabled`, `reactivated`, `membership_changed` |
| `old_value`, `new_value` | text null | Valores anterior e novo em `role_changed` e `membership_changed` |
| `actor_id` | uuid → profiles | `on delete set null` |
| `created_at` | timestamptz | |

Escrita apenas pelas funções `change_user_role` e `set_user_disabled`; sem UPDATE/DELETE.

### RLS
- `profiles`: SELECT do próprio perfil (se ativo) ou de todos pela gerência. Sem INSERT/UPDATE/DELETE pelo cliente.
- `invitations`: SELECT e INSERT apenas pela gerência ativa; INSERT exige `created_by = auth.uid()`.
- `account_events`: SELECT apenas pela gerência ativa; sem escrita pelo cliente.
- `anon` não tem acesso a tabelas.

## Planejado

### Contas (pendências)
- **Ocultar do ranking** (D35, Fase 6): coluna em `profiles` alterável só pela gerência, com evento em `account_events`.
- **Aceite dos termos** (D34, Fase 8): `terms_acceptances` (`user_id`, `terms_version`,
  `privacy_version`, `accepted_at`), imutável, gravada por função do banco com a versão vigente
  (o cliente não escolhe a versão); apagada com a conta (D30).
- **Leitura pública de nome**: fila de revisão e ranking precisam do nome de exibição de outras pessoas; expor por view/RPC que retorne apenas `id` e `display_name`, sem e-mail.
- **Exclusão de conta** (D30, Fase 8): apaga perfil, credenciais e dados próprios (progresso, submissões, XP, competências) via `on delete cascade`; revisões feitas pela pessoa são mantidas com `reviewer_id` nulo e a cópia `reviewer_name`. Toda nova FK para `profiles` deve declarar esse comportamento.

### Conteúdo (Fase 3) — conforme `docs/product/LEARNING_PATHS.md`
Conceitual; o nome e o tipo final das colunas são fixados na migração.

- **`learning_paths`**: `id`, `title`, `slug` unique, `description`, `allowed_memberships` (vínculos com acesso,
  conjunto não vazio de `trainee`/`efetivado`, D44), `status` (`draft`, `published`, `archived`), `sort_order`, `created_by`,
  `updated_by`, timestamps.
- **`learning_path_prerequisites`** (D27): (`learning_path_id`, `required_path_id`,
  `applies_to`) com `applies_to` = vínculo a que o pré-requisito se aplica (padrão: trainee);
  CHECK contra autorreferência; ciclos rejeitados na escrita.
- **Prazos** (D31, D50): ficam no evento. `path_events.due_at` (`timestamptz`, nulo quando a
  trilha não tem evento não se aplica; obrigatório no evento, = data de conclusão) e
  `path_event_blocks` (`event_id`, `block_id`, `due_at`) para prazos próprios por bloco, com
  CHECK de que `due_at` do bloco não passa do `due_at` do evento. Atraso é derivado (agora >
  prazo e item não concluído), nunca gravado.
- **Eventos de trilha** (D49): `path_events` (`id`, `learning_path_id`, `name`, `starts_at`,
  `ends_at` (= prazo da trilha, D50), `created_by`, `updated_by`, timestamps; CHECK `ends_at` > `starts_at`) e
  `path_event_members` (`event_id`, `user_id`) PK composta, com `added_by` e `added_at`. A
  designação exige acesso à trilha (validado na escrita).
- **Regra de acesso:** a pessoa acessa a trilha se o seu vínculo está em
  `allowed_memberships` e os pré-requisitos aplicáveis ao seu vínculo estão concluídos.
  Verificada no servidor e no RLS, nunca só na interface.
- **`blocks`** (D38): `id`, `learning_path_id`, `title`, `description`, `badge_title` (título
  de perfil concedido, D42), `sort_order`, `status`.
- **`items`** (D38, D40): `id`, `block_id` **ou** `learning_path_id` (a entrega geral pertence
  à trilha, não a um bloco; CHECK de exatamente um), `item_type` (`video`, `open_question`,
  `link_submission`, `block_final`, `path_final`), `title`, `instructions`, `url` (vídeo:
  CHECK `http`/`https`), `approval_criteria` (obrigatório para entregas), `sort_order`,
  `status`, `created_by`, `updated_by`, timestamps.
  - Conclusão derivada do tipo: `video` autodeclarado; demais por revisão. Sem valor livre.
  - Edição altera o mesmo registro (D26). Prazos ficam no evento (D50).
- **`competencies`** e **`item_competencies`**: como antes, associadas a itens com entrega.

### Progresso e revisão (Fases 4–5)
- **`item_progress`**: `id`, `user_id`, `item_id`, `status` (`in_progress`, `completed`), `started_at`, `completed_at`, `updated_at`. Unique (`user_id`, `item_id`). Ausência de linha = não iniciada. Estados de revisão **não** são duplicados aqui (D3).
- **`submissions`**: `id`, `user_id`, `item_id`, `version` int, `evidence_url` (CHECK `http`/`https`), `evidence_text`, CHECK de ao menos um dos dois (D25), `status` (`pending`, `claimed`, `approved`, `changes_requested`, `withdrawn`), `claimed_by`, `claimed_at`, `submitted_at`, `updated_at`.
  - Unique (`user_id`, `item_id`, `version`); no máximo uma submissão aberta (`pending`/`claimed`) por usuário e item (índice único parcial).
  - Reenvio cria nova linha com `version + 1` (D4). Após aprovação, não há novo envio (suposição).
  - CHECK `claimed_by <> user_id`.
- **`reviews`**: `id`, `submission_id`, `reviewer_id` (`on delete set null`), `reviewer_name` (cópia do nome no momento da revisão, mantida se a conta for excluída, D30), `decision` (`approved`, `changes_requested`), `feedback`, `created_at`. Imutável (sem UPDATE/DELETE), uma linha por decisão.
- **`submission_events`** (suposição): assumir, liberar e reatribuir (D19), com autor e data.

### Competências e gamificação (Fase 6)
- **`user_competencies`** (D2): (`user_id`, `competency_id`) PK, `state` (`not_demonstrated`, `in_development`, `demonstrated`), `updated_at`. Ausência de linha = não demonstrada.
- **`competency_evidence`** (D2): `id`, `user_id`, `competency_id`, `item_id`, `submission_id` null, `event_type` (`started`, `approved`, `correction`), `resulting_state`, `reason` (obrigatório em correção), `created_by`, `created_at`. Imutável.
- **`xp_rules`** (D41): `item_type` PK (inclui `path_completion`), `xp` int ≥ 0,
  `updated_by`, `updated_at`; mantida pela gerência; mudanças não alteram XP já concedido. Valores iniciais (D13):
  `video` 100, `open_question` 300, `link_submission` 600, `block_final` 1.500,
  `path_completion` 5.000. Sem teto de XP por pessoa.
- **`user_titles`** (D42): (`user_id`, `block_id`) PK, `title_snapshot`, `earned_at`; e
  `profiles.featured_block_id` para o título exibido.
- **`xp_transactions`**: `id`, `user_id`, `amount` (≠ 0), `event_type` (`item_completed`, `submission_approved`, `path_completed`, `correction`), `source_type`, `source_id`, `idempotency_key` unique, `reason` (obrigatório em correção), `created_by`, `created_at`. Imutável. Chave idempotente: `item:<item_id>:user:<user_id>` para itens, `path:<path_id>:user:<user_id>` para conclusão de trilha (uma por pessoa, D41).
- **`level_rules`** (D14): `level` PK, `minimum_xp` unique crescente; nível 1 com `minimum_xp = 0`.
  Valores iniciais pela fórmula 125 × n × (n − 1), do nível 1 ao 20 (0; 250; 750; 1.500; 2.500; ...;
  47.500). O nível de uma pessoa é o maior com `minimum_xp` ≤ seu XP total; acima do último
  nível cadastrado vale o último, e a gerência pode acrescentar níveis. Calculado, não gravado.

### Métricas de acompanhamento (Fase 7, D48)
- Sem tabela própria: as métricas de RB-09 são calculadas a partir de `item_progress`,
  `submissions`, `reviews`, `xp_transactions`, `user_titles`, `path_event_members` e `profiles`.
- Expostas por funções do banco que verificam o papel (`reviewer` ou superior para métricas de
  outras pessoas; o próprio usuário para os seus valores) e retornam só os campos das métricas,
  nunca o e-mail.
- A taxa de conclusão usa como denominador os membros ativos de `path_event_members` do evento.
- Se o cálculo ficar lento, uma view materializada pode ser criada depois, mantendo as mesmas
  definições.

## Integridade
- Foreign keys em todas as relações, com comportamento de exclusão explícito.
- CHECKs para status, tipos e valores permitidos.
- Unique constraints para idempotência de recompensa e progresso por usuário/item.
- Transições de estado validadas em funções SQL transacionais (aprovar, assumir, conceder XP, corrigir).
- Tabelas de histórico (`reviews`, `competency_evidence`, `xp_transactions`, eventos) sem UPDATE/DELETE para clientes.
- Índices para fila pendente, submissões por usuário, itens por bloco e XP por usuário.
- RLS habilitada e testada em toda tabela acessível ao cliente.
