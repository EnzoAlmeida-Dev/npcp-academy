# NPCP Academy — Agent Instructions

## Missão
Construir uma plataforma web de capacitação técnica para membros e trainees do Núcleo de Projetos de Computação (NPCP), começando por uma trilha piloto de desenvolvimento web.

## Fonte de verdade
- Produto e escopo: `docs/product/PRD.md`
- Critérios verificáveis: `docs/product/ACCEPTANCE_CRITERIA.md`
- Fluxos: `docs/product/USER_FLOWS.md`
- Arquitetura: `docs/architecture/SYSTEM_DESIGN.md`
- Modelo de dados: `docs/architecture/DATA_MODEL.md`
- Segurança: `docs/architecture/SECURITY.md`
- Decisões técnicas: `docs/decisions/`
- Plano de implementação: `docs/implementation/IMPLEMENTATION_PLAN.md`

Se documentos entrarem em conflito, não escolha silenciosamente. Descreva o conflito, identifique o impacto e peça uma decisão se ela afetar produto, segurança, dados ou arquitetura.

## Modo de trabalho
1. Inspecione o repositório e leia as instruções antes de editar.
2. Antes de cada etapa, apresente objetivo, arquivos que pretende alterar, riscos e testes.
3. Faça mudanças pequenas, coesas e revisáveis.
4. Não implemente funcionalidades fora do MVP sem aprovação explícita.
5. Não invente regras de negócio para preencher lacunas importantes.
6. Quando uma decisão for reversível e de baixo impacto, proponha uma opção simples e registre a suposição.
7. Atualize documentação e testes quando o comportamento mudar.
8. Não declare sucesso sem executar os testes relevantes; liste o que não foi executado.

## Regras de engenharia
- Use TypeScript e os padrões já estabelecidos no repositório.
- Valide dados em todas as fronteiras de confiança.
- Faça autorização no servidor e no banco quando aplicável; controles de interface não substituem autorização.
- Nunca exponha chaves privilegiadas, segredos ou credenciais no cliente.
- Não permita que o navegador escolha diretamente o saldo ou a quantidade de XP.
- Conceda XP por operações confiáveis, idempotentes e auditáveis.
- Use migrações versionadas para mudanças de esquema.
- Use restrições e transações no banco para preservar integridade.
- Evite abstrações prematuras e microserviços.
- Não armazene dados pessoais desnecessários.
- Nunca use dados reais de membros em seeds ou testes versionados.

## Segurança e revisão
- Teste acesso permitido e negado para cada papel.
- Teste que usuários não podem consultar ou alterar dados privados de outros usuários.
- Teste envio duplicado, revisão concorrente e concessão duplicada de XP.
- Uma pessoa não deve aprovar a própria entrega.
- Não confie em `user_id`, papel, XP ou status enviados pelo cliente sem validar a autorização no servidor.
- Registre quem revisou, quando revisou, decisão e feedback.
- Não altere silenciosamente uma aprovação passada; use histórico ou evento corretivo.

## Testes e qualidade
- Adicione testes unitários para regras de negócio.
- Adicione testes de integração para operações de banco e autorização.
- Adicione testes de ponta a ponta para os fluxos principais quando a infraestrutura permitir.
- Execute lint, verificação de tipos, testes e build aplicáveis.
- Corrija falhas antes de avançar ou explique explicitamente o bloqueio.

## Conclusão de tarefa
Ao finalizar, informe:
1. O que foi implementado.
2. Arquivos alterados.
3. Migrações criadas.
4. Testes executados e resultados.
5. Suposições feitas.
6. Riscos ou tarefas restantes.

## Fora de escopo sem aprovação
- Integrações com APIs do YouTube ou GitHub.
- Hospedagem ou execução de código submetido.
- Recomendação de aprendizagem por IA.
- Notificações automáticas.
- Certificados formais.
- Microserviços.
- Rankings avançados além do ranking geral de XP.
