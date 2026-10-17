# ADR-001 — Stack candidata para o MVP

- Status: proposta, aguardando confirmação.
- Data: 2026-10-15.

## Contexto
O produto precisa de interface web responsiva, autenticação, banco relacional, autorização robusta e implantação simples. O projeto será desenvolvido por uma pessoa com assistência de agente de código.

## Decisão proposta
- Next.js + TypeScript para aplicação.
- Tailwind CSS para UI.
- Supabase Auth + PostgreSQL + RLS para identidade e dados.
- Vercel como opção de hospedagem da aplicação.
- Monólito modular.

## Motivos
- Um único repositório reduz complexidade.
- PostgreSQL representa bem relações entre trilhas, atividades, evidências e usuários.
- Serviço gerenciado reduz o esforço operacional do MVP.
- TypeScript oferece verificação estática útil em desenvolvimento assistido por IA.

## Alternativas consideradas
- Backend separado: maior separação, mas mais configuração e operação.
- Banco e autenticação próprios: maior controle, porém mais responsabilidade de segurança.
- Aplicação apenas local: simplifica demonstração, mas não atende ao objetivo de uso online.

## Consequências
- É necessário aprender e testar RLS, migrações e políticas de acesso.
- Custos, limites de plano, região de dados e compatibilidade devem ser confirmados antes da publicação.
- A aplicação deve encapsular regras de negócio para reduzir acoplamento ao provedor.

## Revisão
Revisar esta decisão após o protótipo técnico ou se surgirem restrições de custo, privacidade, política institucional ou experiência do desenvolvedor.
