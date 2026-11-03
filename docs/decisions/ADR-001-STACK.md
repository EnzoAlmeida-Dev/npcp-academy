# ADR-001 — Stack do MVP

- Status: **aceita**.
- Proposta: 2026-10-15. Aceita e implantada: 2026-11-03.

## Contexto
O produto precisa de interface web responsiva, autenticação, banco relacional, autorização robusta e implantação simples. O projeto é desenvolvido por uma pessoa com assistência de agente de código.

## Decisão
- Next.js + TypeScript para a aplicação (monólito modular).
- Tailwind CSS para UI.
- Supabase Auth + PostgreSQL + RLS para identidade e dados, em nuvem na região São Paulo.
- Vercel para hospedagem, com domínio próprio.
- Resend como SMTP dos e-mails de autenticação.

## Motivos
- Um único repositório reduz complexidade.
- PostgreSQL representa bem relações entre trilhas, atividades, evidências e usuários.
- Serviços gerenciados reduzem o esforço operacional do MVP.
- TypeScript oferece verificação estática útil em desenvolvimento assistido por IA.

## Alternativas consideradas
- Backend separado: maior separação, mas mais configuração e operação.
- Banco e autenticação próprios: maior controle, porém mais responsabilidade de segurança.
- Aplicação apenas local: não atende ao objetivo de uso online.

## Consequências
- Regras críticas ficam em RLS e funções SQL, que precisam de testes de integração.
- Planos gratuitos têm limites (Vercel Hobby para uso não comercial; Supabase gratuito pode pausar por inatividade).
- Não há restrição institucional de hospedagem ou região (D17).
- A aplicação encapsula regras de negócio para reduzir acoplamento ao provedor.

## Revisão
Revisar se surgirem restrições de custo, privacidade, política institucional ou se os limites dos planos gratuitos forem atingidos.
