# Modelo de dados — NPCP Academy

Referências `Dnn` apontam para `docs/product/DECISIONS.md`. A seção "Implementado" reflete as migrações em `supabase/migrations/`; em caso de divergência, a migração prevalece e este documento deve ser corrigido. A seção "Planejado" é conceitual: nomes e tipos finais são fixados na migração da fase correspondente.

## Implementado

### `user_role` (enum)
`member`, `reviewer`, `manager` — hierarquia via `role_rank()` (D1).

### `profiles`
| Coluna | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | = `auth.users.id`, `on delete cascade` |
| `display_name` | text null | Obrigatório pela aplicação antes do uso (D28); nulo até ser definido |
| `role` | `user_role` | default `member`; definido pelo convite |
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
| `list_users_for_admin()` | Gerência; perfis + e-mail de `auth.users` |
| `handle_new_user`, `set_updated_at` | Triggers |

### RLS
- `profiles`: SELECT do próprio perfil (se ativo) ou de todos pela gerência. Sem INSERT/UPDATE/DELETE pelo cliente.
- `invitations`: SELECT e INSERT apenas pela gerência ativa; INSERT exige `created_by = auth.uid()`.
- `anon` não tem acesso a tabelas.

## Planejado

### Contas (Fase 2b)
- **Nome de exibição** (D28): RPC para o próprio usuário definir `display_name` (validação de tamanho; sem alterar outros campos).
- **Gestão de papéis e status** (D9, D21, D29): RPCs da gerência para alterar `role`, `disabled_at`; regras de "não alterar o próprio papel" e "manter ao menos um gerente ativo" verificadas na mesma transação.
- **`account_events`** (suposição): histórico imutável de mudanças de papel e status (`user_id`, `event_type`, `old_value`, `new_value`, `actor_id`, `created_at`).
- **Leitura pública de nome**: fila de revisão e ranking precisam do nome de exibição de outras pessoas; expor por view/RPC que retorne apenas `id` e `display_name`, sem e-mail.
- **Exclusão de conta**: política de FKs depende de D30. Toda nova FK para `profiles` deve ter o comportamento de exclusão decidido explicitamente.

### Conteúdo (Fase 3)
- **`learning_paths`**: `id`, `title`, `slug` unique, `description`, `status` (`draft`, `published`, `archived`), `sort_order`, `created_by`, `updated_by`, `created_at`, `updated_at`.
- **`learning_path_prerequisites`** (D27): (`learning_path_id`, `required_path_id`) PK composta; CHECK contra autorreferência; ciclos rejeitados na escrita. Regra de conclusão de trilha: D32.
- **`modules`**: `id`, `learning_path_id`, `title`, `description`, `sort_order`.
- **`activities`**: `id`, `module_id`, `title`, `description`, `instructions`, `activity_type` (`content`, `exercise`, `project`, `assessment`), `completion_criteria`, `approval_criteria` (obrigatório quando exige revisão), `xp_reward` int ≥ 0 (elegível quando > 0, D15), `status` (`draft`, `published`, `archived`), `sort_order`, `created_by`, `updated_by`, timestamps.
  - Modo de conclusão derivado do tipo (D24): `content` → autodeclarado; demais → revisão. Implementar como coluna gerada ou função, sem valor livre.
  - Edição altera o mesmo registro (D26). Prazos (D31) não modelados.
- **`activity_resources`**: `id`, `activity_id`, `url` (CHECK `http`/`https`), `label`, `resource_type`, `sort_order`.
- **`competencies`**: `id`, `name` unique, `description`, `criteria`.
- **`activity_competencies`**: (`activity_id`, `competency_id`) PK composta.

### Progresso e revisão (Fases 4–5)
- **`activity_progress`**: `id`, `user_id`, `activity_id`, `status` (`in_progress`, `completed`), `started_at`, `completed_at`, `updated_at`. Unique (`user_id`, `activity_id`). Ausência de linha = não iniciada. Estados de revisão **não** são duplicados aqui (D3).
- **`submissions`**: `id`, `user_id`, `activity_id`, `version` int, `evidence_url` (CHECK `http`/`https`), `evidence_text`, CHECK de ao menos um dos dois (D25), `status` (`pending`, `claimed`, `approved`, `changes_requested`, `withdrawn`), `claimed_by`, `claimed_at`, `submitted_at`, `updated_at`.
  - Unique (`user_id`, `activity_id`, `version`); no máximo uma submissão aberta (`pending`/`claimed`) por usuário e atividade (índice único parcial).
  - Reenvio cria nova linha com `version + 1` (D4). Após aprovação, não há novo envio (suposição).
  - CHECK `claimed_by <> user_id`.
- **`reviews`**: `id`, `submission_id`, `reviewer_id`, `decision` (`approved`, `changes_requested`), `feedback`, `created_at`. Imutável (sem UPDATE/DELETE), uma linha por decisão.
- **`submission_events`** (suposição): assumir, liberar e reatribuir (D19), com autor e data.

### Competências e gamificação (Fase 6)
- **`user_competencies`** (D2): (`user_id`, `competency_id`) PK, `state` (`not_demonstrated`, `in_development`, `demonstrated`), `updated_at`. Ausência de linha = não demonstrada.
- **`competency_evidence`** (D2): `id`, `user_id`, `competency_id`, `activity_id`, `submission_id` null, `event_type` (`started`, `approved`, `correction`), `resulting_state`, `reason` (obrigatório em correção), `created_by`, `created_at`. Imutável.
- **`xp_transactions`**: `id`, `user_id`, `amount` (≠ 0), `event_type` (`activity_completed`, `submission_approved`, `correction`), `source_type`, `source_id`, `idempotency_key` unique, `reason` (obrigatório em correção), `created_by`, `created_at`. Imutável. Chave idempotente: `activity:<activity_id>:user:<user_id>` para recompensas (uma por usuário e atividade, D15).
- **`level_rules`**: `level` PK, `minimum_xp` unique; nível 1 com `minimum_xp = 0`. Valores: D14.

## Integridade
- Foreign keys em todas as relações, com comportamento de exclusão explícito.
- CHECKs para status, tipos e valores permitidos.
- Unique constraints para idempotência de recompensa e progresso por usuário/atividade.
- Transições de estado validadas em funções SQL transacionais (aprovar, assumir, conceder XP, corrigir).
- Tabelas de histórico (`reviews`, `competency_evidence`, `xp_transactions`, eventos) sem UPDATE/DELETE para clientes.
- Índices para fila pendente, submissões por usuário, atividades por módulo e XP por usuário.
- RLS habilitada e testada em toda tabela acessível ao cliente.
