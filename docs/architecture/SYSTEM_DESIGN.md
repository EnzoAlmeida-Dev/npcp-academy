# System Design — NPCP Academy

## Status
Arquitetura candidata. Confirmar versões atuais e compatibilidade antes de implementar.

## Stack proposta
- Next.js com TypeScript para aplicação web full-stack.
- Tailwind CSS para estilos.
- Supabase Auth para autenticação, PostgreSQL para persistência e RLS para políticas de acesso.
- Vercel como opção de hospedagem da aplicação.
- Testes unitários e de integração; ferramenta E2E escolhida após criar o esqueleto.

## Princípios
1. Monólito modular, sem microserviços.
2. Regras de negócio críticas executadas no servidor.
3. Banco relacional como fonte persistente de verdade.
4. Autorização em todas as operações, não apenas na interface.
5. Histórico auditável para revisões e XP.
6. Migrações versionadas e seeds fictícios.
7. Integrações externas limitadas a links no MVP.

## Módulos lógicos
- Identity & Invitations
- Learning Paths & Content
- Activity Progress
- Submissions & Reviews
- Competencies & Evidence
- Gamification
- Admin & Analytics

Os módulos podem ser pastas/features dentro da mesma aplicação. Não precisam ser serviços independentes.

## Fluxos críticos no servidor
### Aprovar submissão
1. Validar sessão e papel do revisor.
2. Carregar submissão e verificar estado atual.
3. Impedir autoavaliação.
4. Registrar decisão e feedback.
5. Atualizar progresso e competências de acordo com critérios explícitos.
6. Criar transação de XP idempotente, se aplicável.
7. Confirmar todas as alterações críticas de forma transacional.
8. Retornar estado atualizado.

Se o stack escolhido não permitir uma transação segura através da camada da aplicação, encapsular a operação em função SQL/RPC ou mecanismo equivalente no banco.

### Conceder XP
- Evento de origem único.
- Chave idempotente única, por exemplo combinação do tipo de evento e entidade de origem.
- Valor de recompensa definido no lado confiável.
- Operação atômica para registrar evento e atualizar projeção, se houver.
- Correções via evento compensatório, não edição silenciosa.

### Assumir revisão
- Atualização condicional: só atribuir se a submissão ainda estiver sem revisor e pendente.
- Tratar conflito concorrente como resultado esperado e atualizar a fila.

## Observabilidade mínima
- Logs de erros sem tokens ou segredos.
- Registro de decisões de revisão e transações de XP.
- Indicadores de falha de autenticação e erro de aplicação conforme recursos do provedor.

## Ambientes
- Desenvolvimento local.
- Ambiente de teste/staging, se viável.
- Produção.
- Credenciais e bases separadas; não reutilizar dados reais em seeds.

## Implantação
Documentar criação de projeto, variáveis de ambiente, aplicação de migrações, criação do primeiro administrador, seed de conteúdo de demonstração e rollback operacional.
