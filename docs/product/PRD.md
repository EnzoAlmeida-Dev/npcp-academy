# Product Requirements Document — NPCP Academy

- Versão: 1.0
- Status: proposta para validação
- Produto: plataforma interna de capacitação técnica do NPCP
- Público: membros e trainees
- Trilha piloto: desenvolvimento web

## 1. Visão
O NPCP Academy organiza trilhas de aprendizagem, atividades práticas e evidências de competências em uma plataforma online. O produto deve facilitar a evolução individual e permitir que responsáveis acompanhem a capacitação sem depender exclusivamente de planilhas ou controles dispersos.

## 2. Problema e hipóteses
### Contexto de partida
A aprendizagem técnica no núcleo ocorre em parte por meio da participação em projetos. A plataforma é proposta para estruturar trilhas, atividades e evidências de aprendizagem.

### Hipóteses a validar
- Trilhas explícitas ajudam membros e trainees a compreender o próximo passo.
- Atividades práticas com critérios claros ajudam a demonstrar competências.
- Um fluxo compartilhado de revisão pode distribuir a carga de avaliação.
- XP e níveis podem estimular participação sem substituir a avaliação técnica.
- Um painel coletivo pode apoiar decisões de capacitação.

Não apresentar estas hipóteses como resultados comprovados antes de um piloto.

## 3. Objetivos
1. Permitir que membros acessem uma trilha e acompanhem seu progresso.
2. Organizar aulas externas, exercícios e projetos práticos.
3. Permitir submissão de evidências e revisão de entregas relevantes.
4. Representar competências em três estados: não demonstrada, em desenvolvimento e demonstrada.
5. Oferecer XP, níveis e ranking geral de XP com regras transparentes.
6. Permitir que gerência e responsáveis técnicos mantenham trilhas e atividades.
7. Fornecer visão agregada do progresso e da fila de revisão.

## 4. Não objetivos do MVP
- Substituir plataformas de vídeo ou hospedar cursos.
- Executar código submetido dentro do website.
- Certificar formalmente proficiência profissional.
- Integrar-se diretamente com APIs do YouTube ou GitHub.
- Oferecer recomendação de conteúdo por IA.
- Enviar notificações automáticas.
- Implementar rankings sofisticados ou avaliações psicométricas.
- Gerenciar remuneração, promoção ou alocação de projetos.
- Construir arquitetura de microserviços.

## 5. Personas e permissões
### Membro/trainee
Pode ver trilhas publicadas, iniciar atividades, registrar progresso, enviar evidências, consultar feedback, competências e XP próprios e ver o ranking geral conforme a política definida.

### Responsável técnico
Pode criar e editar conteúdo dentro das permissões atribuídas, revisar entregas na fila compartilhada e fornecer feedback. Não pode aprovar a própria submissão.

### Gerência
Pode administrar usuários e convites, configurar conteúdo, atribuir responsáveis, consultar dados individuais e agregados e administrar regras de XP autorizadas. A gerência não deve editar diretamente o histórico de XP; correções devem gerar eventos auditáveis.

No MVP, gerência e responsáveis técnicos podem ser papéis distintos ou permissões combinadas. A implementação deve suportar autorização explícita, sem depender de nomes ou e-mails fixos.

## 6. Estrutura pedagógica
Trilha → módulos → atividades → competências associadas.

Tipos iniciais de atividade:
- Conteúdo: aula externa, frequentemente YouTube.
- Exercício: desafio com resposta ou link de evidência.
- Projeto: entrega prática com critérios de avaliação.
- Avaliação: revisão técnica ou explicação da solução.

Cada atividade publicada deve conter:
- título e descrição;
- instruções;
- tipo;
- ordem dentro do módulo;
- links externos opcionais;
- competências associadas;
- critério de conclusão;
- modo de conclusão: autodeclarado ou exige revisão;
- recompensa de XP;
- estado publicado/rascunho;
- critérios de aprovação quando houver revisão.

Não presumir que assistir a um vídeo comprova domínio técnico.

## 7. Requisitos funcionais
### Must have
- RF-01 Autenticação de usuários.
- RF-02 Entrada por convite de uso único, com validade e controle de expiração.
- RF-03 Papéis e autorização para membro/trainee, responsável técnico e gerência.
- RF-04 Catálogo de trilhas publicadas.
- RF-05 Organização de trilhas em módulos e atividades.
- RF-06 Exibição de conteúdo externo por link.
- RF-07 Registro de progresso individual por atividade.
- RF-08 Conclusão autodeclarada para atividades simples, segundo regra explícita.
- RF-09 Submissão de evidências para atividades que exigem revisão.
- RF-10 Fila compartilhada de submissões aguardando revisão.
- RF-11 Revisão com aprovação ou solicitação de ajustes, feedback e histórico.
- RF-12 Catálogo de competências e associação entre atividades e competências.
- RF-13 Estado individual de competência: não demonstrada, em desenvolvimento ou demonstrada.
- RF-14 XP concedido por eventos elegíveis e registrado em histórico auditável.
- RF-15 Níveis derivados de limites de XP configuráveis.
- RF-16 Perfil individual com progresso, competências e histórico de XP.
- RF-17 Ranking geral de XP.
- RF-18 Painel gerencial com progresso por trilha e fila de revisão.
- RF-19 Interface administrativa para gerenciar trilhas, módulos, atividades, competências, critérios e valores de XP.
- RF-20 Layout responsivo para computador e celular.

### Should have
- RF-21 Filtros na fila por idade da submissão, trilha e atividade.
- RF-22 Histórico de feedback e reenvio de evidência.
- RF-23 Filtros básicos no painel por trilha e período.
- RF-24 Página de regras de XP e níveis visível aos usuários.

### Could have
- RF-25 Conquistas/medalhas simples.
- RF-26 Exportação CSV de métricas agregadas, com autorização.

### Won't have now
- RF-27 Integração direta com APIs externas.
- RF-28 Notificações automáticas.
- RF-29 Recomendação personalizada por IA.
- RF-30 Execução de código no servidor.
- RF-31 Certificação formal.

## 8. Regras de negócio
### RB-01 — Convites
- Um convite é destinado a um e-mail e tem token aleatório, uso único e expiração.
- O token armazenado deve ser protegido por hash quando viável; não armazenar tokens reutilizáveis em texto puro.
- O convite é invalidado após uso ou revogação.
- Não revelar se um e-mail já possui conta em mensagens públicas de autenticação.
- Definir antes do lançamento se convites podem ser criados apenas pela gerência.

### RB-02 — Progresso
- Cada usuário tem um estado independente para cada atividade.
- Estados básicos: não iniciada, em andamento e concluída.
- Atividades com revisão usam também estados como aguardando revisão e ajustes solicitados.
- Uma atividade que exige revisão não fica concluída/aprovada até aprovação.
- O reenvio não cria um novo progresso duplicado; deve manter histórico de submissões.

### RB-03 — Revisão compartilhada
- Qualquer revisor elegível pode assumir uma submissão não atribuída.
- A operação de assumir deve ser atômica para evitar dois revisores assumirem simultaneamente.
- Uma submissão atribuída pode ser liberada por seu responsável autorizado.
- Um revisor não pode avaliar sua própria entrega.
- A decisão registra revisor, data, status e feedback.
- Aprovação ou rejeição não pode ser silenciosamente sobrescrita.
- Definir se gerência pode reatribuir uma revisão presa antes da produção.

### RB-04 — Competências
- Estados: não demonstrada, em desenvolvimento, demonstrada.
- Iniciar uma atividade associada pode mover a competência para “em desenvolvimento”, segundo regra consistente.
- Só uma evidência aprovada por critério configurado pode marcar competência como “demonstrada”.
- A mesma competência pode ser associada a várias atividades.
- A relação entre estado e evidências deve ser rastreável.
- Uma competência demonstrada não deve regredir automaticamente por uma simples alteração de progresso. Correções exigem ação auditável.

### RB-05 — XP
- Valores de XP são configurados no servidor ou banco, nunca confiados ao cliente.
- XP é concedido por eventos elegíveis e idempotentes.
- Atualizar a página, reenviar uma requisição ou repetir um callback não pode duplicar a recompensa.
- Uma aprovação gera a recompensa correspondente apenas uma vez.
- Recompensas de conclusão autodeclarada devem ter limites e regras para reduzir abuso.
- Ajustes de XP devem ser transações corretivas com motivo, autor e data; não editar o histórico anterior.
- O saldo é calculado a partir do livro de transações ou mantido como projeção consistente.
- XP não é uma medida equivalente à proficiência.

### RB-06 — Níveis e ranking
- Nível deriva do XP total usando limites documentados.
- Ranking geral ordena por XP segundo política publicada.
- Empates usam uma regra estável, por exemplo empate na posição; não inventar diferenças artificiais.
- Não mostrar e-mail ou informação pessoal desnecessária no ranking.
- O ranking deve ser secundário em relação a competências e entregas validadas.

### RB-07 — Conteúdo
- Apenas conteúdo publicado é visível como trilha oficial para membros.
- Alterações de conteúdo não devem apagar progresso ou submissões passadas.
- A atividade deve guardar critérios de conclusão claros.
- URLs externas são validadas e exibidas como links; não executar conteúdo arbitrário.
- A gerência e responsáveis técnicos só editam conteúdo conforme permissões atribuídas.

## 9. Requisitos não funcionais
- RNF-01 Segurança: autorização no servidor e políticas no banco; não depender apenas da UI.
- RNF-02 Privacidade: coletar somente dados necessários e limitar visibilidade por papel.
- RNF-03 Integridade: operações críticas em transações e protegidas contra duplicidade.
- RNF-04 Auditabilidade: revisar submissões e recompensas com histórico.
- RNF-05 Responsividade: fluxos principais funcionam em telas pequenas.
- RNF-06 Manutenibilidade: conteúdo pode ser alterado sem editar código.
- RNF-07 Testabilidade: regras críticas cobertas por testes.
- RNF-08 Implantação: publicação reproduzível e documentada.
- RNF-09 Acessibilidade: foco visível, rótulos de formulário, contraste adequado e não depender apenas de cor.
- RNF-10 Resiliência: erros de rede e repetição de pedidos não criam registros duplicados.

## 10. Métricas do piloto
- Adoção: membros elegíveis que iniciaram ao menos uma atividade / membros elegíveis.
- Conclusão: atividades concluídas / atividades iniciadas, segmentadas por tipo.
- Competências demonstradas: contagem de competências com evidência aprovada por membro e trilha.
- Tempo de revisão: tempo entre envio e decisão.
- Aplicação prática: evidências de uso das competências em projetos reais, se houver dados comparáveis.

Não definir metas numéricas sem linha de base. Métricas são indicadores, não prova causal automática de impacto.

## 11. Critério de sucesso do MVP
O MVP é funcional quando um usuário convidado consegue completar uma trilha de demonstração do início ao fim; uma entrega relevante pode ser assumida e revisada por um responsável elegível; uma aprovação atualiza a competência e concede XP sem duplicidade; e a gerência consegue ver o progresso e a fila de revisão.

## 12. Decisões ainda abertas
- Stack final e fornecedor de hospedagem.
- Política de convite e recuperação de conta.
- Valores finais de XP e limites de nível.
- Quais atividades são autodeclaradas e quais exigem revisão.
- Regra exata para passar competência a “em desenvolvimento”.
- Política de visibilidade do ranking e dados individuais.
- Política de retenção/exclusão de dados de membros desligados.
- Reatribuição de submissões sem resposta e prazo esperado de revisão.
- Se uma trilha é obrigatória ou opcional e se há pré-requisitos.
