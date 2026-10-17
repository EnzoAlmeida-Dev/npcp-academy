# Modelo de dados — NPCP Academy

Modelo conceitual inicial; nomes e tipos exatos serão definidos em migrações.

## Entidades
### profiles
- `id`: igual ao identificador do provedor de autenticação.
- `display_name`
- `role`: member, reviewer, manager (ou permissões equivalentes).
- `created_at`, `updated_at`, `disabled_at` opcional.

Não duplicar senha nem armazenar segredos de autenticação na tabela de perfil.

### invitations
- `id`
- `email_normalized`
- `token_hash`
- `expires_at`
- `used_at`
- `revoked_at`
- `created_by`
- `created_at`

Token de uso único; restrições e validação devem impedir consumo duplo.

### learning_paths
- `id`, `title`, `slug`, `description`
- `status`: draft, published, archived
- `created_by`, `updated_by`
- `created_at`, `updated_at`

### modules
- `id`, `learning_path_id`, `title`, `description`, `sort_order`

### activities
- `id`, `module_id`, `title`, `description`, `activity_type`
- `completion_mode`: self_declared ou review_required
- `completion_criteria`
- `xp_reward`
- `status`: draft, published, archived
- `sort_order`, `created_by`, `updated_by`

### activity_resources
- `id`, `activity_id`, `url`, `label`, `resource_type`

### competencies
- `id`, `name`, `description`, `criteria`

### activity_competencies
- `activity_id`, `competency_id`, `evidence_rule`
- Unique constraint para o par activity/competency.

### activity_progress
- `id`, `user_id`, `activity_id`
- `status`: not_started, in_progress, submitted, changes_requested, completed
- `started_at`, `completed_at`, `updated_at`
- Unique constraint em (`user_id`, `activity_id`).

### submissions
- `id`, `user_id`, `activity_id`, `version`
- `evidence_url` e/ou `evidence_text` de acordo com os tipos permitidos
- `status`: pending, claimed, approved, changes_requested, withdrawn
- `claimed_by`, `claimed_at`
- `submitted_at`, `updated_at`
- Cada reenvio preserva versão/histórico; definir estratégia de registro antes da migração.

### reviews
- `id`, `submission_id`, `reviewer_id`
- `decision`: approved ou changes_requested
- `feedback`
- `created_at`
- Registro imutável de cada decisão. Não sobrescrever avaliações anteriores.

### competency_evidence
- `id`, `user_id`, `competency_id`
- `activity_id`, `submission_id` opcional
- `status` ou referência à decisão de origem
- `created_at`, `created_by`
- Evidência suficiente para explicar o estado da competência.

### xp_transactions
- `id`, `user_id`, `amount`, `event_type`
- `source_type`, `source_id`
- `idempotency_key` unique
- `reason`, `created_by` opcional, `created_at`
- Recompensas e correções são eventos separados. Não apagar histórico.

### level_rules
- `id`, `level`, `minimum_xp`
- Limites ordenados e validados.

## Integridade
- Foreign keys em todas as relações relevantes.
- Constraints para status e valores permitidos.
- `xp_reward` não negativo e limitado a valores autorizados.
- Unique constraint para idempotência de recompensas.
- Unique constraint para progresso por usuário/atividade.
- Transições de estado validadas na lógica de negócio.
- Índices para fila pendente, submissões por usuário, atividades por módulo e XP por usuário.
- RLS e políticas testadas para cada tabela acessível ao cliente.

## Questões a decidir antes de migrar
- Papéis simples ou tabela de permissões.
- Como preservar versões de atividades e submissões.
- Como derivar estado de competência a partir de múltiplas evidências.
- Como lidar com usuário desligado e retenção de dados.
- Se ranking mostra todos os membros ou permite optar por exibição.
