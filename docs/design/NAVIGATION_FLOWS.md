# Fluxos de navegação por papel

> Mapa da Arquitetura da Informação (AI) prevista. Na Etapa 1, apenas as telas
> aprovadas são implementadas; o restante é wireframe e não implementa regras
> de negócio pendentes.

## Áreas da plataforma (AI)

- **Dashboard** — ponto de entrada após login.
- **Trilhas** → **Módulos** → **Atividades** (wireframe; regras pendentes).
- **Progresso individual** (wireframe).
- **Entregas e histórico de submissões** (wireframe; modelo aprovado, fase futura).
- **Revisões** (fila) (wireframe; fase futura).
- **Competências** (wireframe; regras D10–D12 pendentes).
- **Administração de convites e usuários** (convites implementados na Etapa 1).

## member

1. Recebe link de convite → aceita (e-mail + senha) → confirma e-mail.
2. Reabre o link → ativação → Dashboard.
3. Futuro: catálogo de trilhas → atividades → progresso → entregas → feedback.

## reviewer

1. Mesmo onboarding do member (papel atribuído pelo convite).
2. Futuro: fila de revisão → assumir → aprovar/solicitar ajustes (não a própria entrega).

## manager

1. Onboarding via bootstrap controlado (ou convite de gerência).
2. Administração de convites (criar/revogar) — Etapa 1.
3. Futuro: usuários/papéis, conteúdo, relatórios.

## Regra de segurança

A navegação apenas reflete as permissões. Toda autorização real é aplicada no
servidor e pelo RLS; ocultar um link na UI não bloqueia acesso.
