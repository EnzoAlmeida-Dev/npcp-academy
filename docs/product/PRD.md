# Product Requirements Document — NPCP Academy

- Versão: 1.2 (2026-11-18)
- Status: validado com o responsável do produto; itens em aberto em `DECISIONS.md`
- Produto: plataforma interna de capacitação técnica do NPCP
- Público: membros e trainees
- Trilha piloto: desenvolvimento web

> Referências `Dnn` apontam para `docs/product/DECISIONS.md`.

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
1. Permitir que membros acessem trilhas, em sequência, e acompanhem seu progresso.
2. Organizar aulas externas, exercícios e projetos práticos.
3. Permitir submissão de evidências e revisão de entregas relevantes.
4. Representar competências em três estados: não demonstrada, em desenvolvimento e demonstrada.
5. Oferecer XP, níveis e ranking geral de XP com regras transparentes.
6. Permitir que responsáveis técnicos e gerência mantenham trilhas e atividades.
7. Fornecer visão agregada do progresso e da fila de revisão.
8. Permitir que a gerência administre contas e repasse papéis às próximas levas (D21).

## 4. Não objetivos do MVP
- Substituir plataformas de vídeo ou hospedar cursos.
- Executar código submetido dentro do website.
- Certificar formalmente proficiência profissional.
- Integrar-se diretamente com APIs do YouTube ou GitHub.
- Oferecer recomendação de conteúdo por IA.
- Enviar notificações automáticas (e-mails de autenticação do Supabase não contam como notificação de produto).
- Receber upload de arquivos como evidência (D25).
- Implementar rankings sofisticados ou avaliações psicométricas.
- Gerenciar remuneração, promoção ou alocação de projetos.
- Construir arquitetura de microserviços.

## 5. Papéis e permissões
Três papéis fixos e hierárquicos (D1); cada um herda as permissões do anterior. A autorização é explícita no servidor e no banco, nunca baseada em nomes ou e-mails fixos.

### Membro/trainee (`member`)
Usufrui das trilhas: vê trilhas publicadas e desbloqueadas, inicia atividades, registra progresso, envia evidências, consulta feedback, competências, XP e nível próprios e vê o ranking geral. Edita o próprio nome de exibição e pode excluir a própria conta (D30).

### Responsável técnico (`reviewer`)
Além do acesso de membro: cria, edita, publica e arquiva qualquer conteúdo (trilhas, blocos, itens, títulos, competências, critérios, valores de XP e pré-requisitos) (D23); revisa entregas na fila compartilhada e fornece feedback; registra correções auditáveis de XP e de competência (D12, D16). Não pode revisar a própria entrega nem corrigir o próprio XP ou competência.

### Gerência (`manager`)
Além do acesso de responsável técnico: administra usuários e convites, altera papéis (inclusive para repassar gerência e responsabilidade técnica, D21), desativa e reativa contas (D9), libera ou reatribui revisões paradas (D19) e consulta dados individuais e agregados. Não edita diretamente o histórico de XP; correções geram eventos auditáveis. Deve existir sempre ao menos um gerente ativo (D29).

## 6. Estrutura pedagógica
A estrutura das trilhas, os tipos de item, o CRUD de trilhas, o XP e os títulos estão
especificados em `docs/product/LEARNING_PATHS.md`. Resumo:

- Duas trilhas principais: trainee e geral (D39). Toda conta tem um vínculo, trainee ou
  efetivado; efetivado acessa todas as trilhas, trainee precisa concluir a trilha trainee
  antes. Cada trilha define no CRUD quais vínculos podem acessá-la (D44).
- Trilha → blocos (vídeos, questões abertas, entregas por link e entrega final do bloco) +
  entrega geral da trilha (D38, D40).
- Trilhas, blocos e itens são criados por CRUD por responsáveis técnicos e gerência, sem
  esqueleto pré-criado (D43).
- Todo item concede XP com peso crescente por tipo (D41); cada bloco concluído concede um
  título de perfil (D42).
- Vídeos são autodeclarados; as demais entregas exigem revisão. Evidências são URL e/ou texto
  (D25). Não presumir que assistir a um vídeo comprova domínio técnico.
- Todos os blocos da trilha ficam acessíveis desde o início (D33). Trilhas e blocos podem ter
  prazo, definido no evento de trilha (D31, D50).
- Uma trilha pode ter eventos (ex.: turmas), com período e membros designados; a taxa de
  conclusão é medida por evento (D49).
- Termos de uso e privacidade em `TERMS_AND_PRIVACY.md` (D34); revisão jurídica recomendada
  antes de abrir a todos os membros.

Neste PRD, **atividade** designa qualquer item de um bloco (vídeo, questão aberta, entrega por
link, entrega final do bloco) e também a entrega geral da trilha.

## 7. Requisitos funcionais
### Must have
- RF-01 Autenticação de usuários, com confirmação de e-mail (D22).
- RF-02 Entrada por convite de uso único, com validade e controle de expiração.
- RF-03 Papéis e autorização para membro/trainee, responsável técnico e gerência.
- RF-04 Catálogo de trilhas publicadas, indicando trilhas bloqueadas e o motivo.
- RF-05 Organização de trilhas em blocos de itens, com entrega final por bloco e entrega geral da trilha (D38).
- RF-06 Exibição de conteúdo externo por link.
- RF-07 Registro de progresso individual por atividade.
- RF-08 Conclusão autodeclarada para vídeos (D40).
- RF-09 Submissão de evidências (URL/texto) para atividades que exigem revisão.
- RF-10 Fila compartilhada de submissões aguardando revisão.
- RF-11 Revisão com aprovação ou solicitação de ajustes, feedback e histórico.
- RF-12 Catálogo de competências e associação entre atividades e competências.
- RF-13 Estado individual de competência: não demonstrada, em desenvolvimento ou demonstrada.
- RF-14 XP concedido por eventos elegíveis e registrado em histórico auditável.
- RF-15 Níveis derivados de limites de XP configuráveis.
- RF-16 Perfil individual com progresso, competências e histórico de XP.
- RF-17 Ranking geral de XP.
- RF-18 Painel gerencial com progresso por trilha e fila de revisão.
- RF-19 CRUD de trilhas para responsáveis técnicos e gerência: trilhas, público, blocos, itens, títulos dos blocos, entrega geral, competências, critérios e pré-requisitos (D43).
- RF-20 Layout responsivo para computador e celular.
- RF-32 Pré-requisitos entre trilhas, bloqueando a trilha até a conclusão dos pré-requisitos (D27).
- RF-33 Definição obrigatória do nome de exibição após a criação da conta (D28).
- RF-34 Gestão de usuários pela gerência: listar, alterar papel, desativar e reativar (D9, D21, D29).
- RF-35 Recuperação de senha por e-mail (D8).
- RF-37 Títulos de perfil por bloco concluído, exibidos no perfil e no ranking e usados como métrica nos painéis (D42).
- RF-38 Tabela de XP por tipo de item, mantida pela gerência (D41).
- RF-39 Vínculo trainee/efetivado por conta, definido pela gerência, e acesso às trilhas por vínculo configurável no CRUD (D44).
- RF-40 Prazos definidos no evento de trilha, com prazo próprio opcional por bloco, e sinalização de atraso (D31, D50).
- RF-41 Termos de uso e aviso de privacidade, com aceite versionado no primeiro acesso (D34).
- RF-42 Métricas de acompanhamento dos membros e taxa de conclusão por evento de trilha nos dashboards da gerência e dos responsáveis técnicos (D48, RB-09).
- RF-43 Eventos de trilha no CRUD: nome, data de início, data de conclusão e membros designados (D49).

### Should have
- RF-21 Filtros na fila por idade da submissão, trilha e atividade.
- RF-22 Histórico de feedback e reenvio de evidência.
- RF-23 Filtros básicos no painel por trilha e período.
- RF-24 Página de regras de XP e níveis visível aos usuários.
- RF-36 Exclusão da própria conta pelo usuário (depende de D30).

### Could have
- RF-25 Conquistas além dos títulos de bloco.
- RF-26 Exportação CSV de métricas agregadas, com autorização.

### Won't have now
- RF-27 Integração direta com APIs externas.
- RF-28 Notificações automáticas.
- RF-29 Recomendação personalizada por IA.
- RF-30 Execução de código no servidor.
- RF-31 Certificação formal.

## 8. Regras de negócio
### RB-01 — Convites e contas
- Um convite é destinado a um e-mail, define o papel inicial e tem token aleatório, uso único e expiração (7 dias).
- O token é armazenado apenas como hash; o token bruto existe só no link.
- O convite é invalidado após uso ou revogação.
- Apenas a gerência cria e revoga convites (D5).
- Não revelar se um e-mail já possui conta em mensagens públicas de autenticação.
- A conta só é ativada após confirmação de e-mail e consumo do convite (D22).
- O nome de exibição é obrigatório antes do uso da plataforma (D28).

### RB-02 — Progresso
- Cada usuário tem um estado independente para cada atividade: não iniciada, em andamento ou concluída.
- Para atividades com revisão, "aguardando revisão" e "ajustes solicitados" são derivados da submissão mais recente, não duplicados no progresso (D3).
- Uma atividade que exige revisão só fica concluída após aprovação.
- O reenvio não cria novo progresso; cria nova versão de submissão (D4).
- Uma trilha bloqueada por pré-requisito não permite iniciar atividades (D27).
- Dentro de uma trilha acessível, todos os blocos publicados estão disponíveis desde o início (D33).

### RB-03 — Revisão compartilhada
- Qualquer revisor elegível pode assumir uma submissão não atribuída.
- A operação de assumir é atômica para evitar dois revisores simultâneos.
- O revisor pode liberar a submissão que assumiu; a gerência pode liberar ou reatribuir qualquer submissão assumida (D19). Não há prazo de revisão.
- Um revisor não pode avaliar sua própria entrega.
- A decisão registra revisor, data, status e feedback.
- Aprovação ou solicitação de ajustes não pode ser sobrescrita; correções usam evento corretivo.

### RB-04 — Competências
- Estados: não demonstrada, em desenvolvimento, demonstrada.
- Iniciar uma atividade associada move a competência para "em desenvolvimento" (D10).
- Uma submissão aprovada de atividade associada marca a competência como "demonstrada" (D11). Conclusão autodeclarada não demonstra competência.
- A mesma competência pode ser associada a várias atividades.
- A relação entre estado e evidências é rastreável.
- Uma competência demonstrada não regride automaticamente. Correções são feitas por gerência ou responsáveis técnicos, com motivo e autor (D12).

### RB-05 — XP
- Valores de XP são configurados no servidor ou banco, nunca confiados ao cliente.
- Todo item da trilha concede XP, com peso por tipo e sem teto (D41).
- XP é concedido uma única vez por usuário e item: na conclusão autodeclarada (vídeo) ou na aprovação (entregas).
- Atualizar a página, reenviar uma requisição ou repetir um callback não pode duplicar a recompensa.
- Ajustes de XP são transações corretivas com motivo, autor e data; o histórico anterior não é editado (D16).
- O saldo é a soma do livro de transações.
- XP não é uma medida equivalente à proficiência.
- Valores por tipo de item: D13 (`LEARNING_PATHS.md` §4). Não há teto de XP.

### RB-06 — Níveis e ranking
- Nível deriva só do XP total, por limites documentados e editáveis pela gerência (D14); não há nível máximo.
- Ranking geral visível a todos os usuários ativos, ordenado por XP (D20).
- Empates compartilham a mesma posição; não inventar diferenças artificiais.
- O ranking mostra apenas nome de exibição, título escolhido, nível e XP; nunca e-mail (D20, D42).
- O ranking deve ser secundário em relação a competências e entregas validadas.

### RB-07 — Conteúdo
- Apenas conteúdo publicado é visível a membros.
- Editar uma atividade não apaga progresso, submissões ou evidências passadas (D26).
- A atividade guarda critérios de conclusão claros.
- URLs externas são validadas (`http`/`https`) e exibidas como links; não executar conteúdo arbitrário.
- Responsáveis técnicos e gerência editam qualquer conteúdo (D23).

### RB-08 — Gestão de contas
- Apenas a gerência altera papéis, desativa e reativa contas.
- Ninguém altera o próprio papel; não é possível rebaixar ou desativar o último gerente ativo (D29).
- Conta desativada não acessa a plataforma; seus dados são mantidos (D9, D18).
- Mudanças de papel e de status de conta são registradas com autor e data.
- Exclusão da própria conta: regras em D30 (aberta).

### RB-09 — Métricas de acompanhamento dos membros
Regra interna (D47, D48, D49). Servem para acompanhar os membros e montar planos de ação
personalizados, e para perceber desengajamento; não têm relação específica com promoção.

**Quem vê:** gerência e responsáveis técnicos, nos seus dashboards e no painel de usuários. O
membro vê os próprios valores no perfil. Membros não veem as métricas de outras pessoas.

**Por membro:**

| Métrica | Definição |
|---|---|
| Nível | Nível atual, calculado pelo XP total (D14), com o XP ao lado |
| Títulos ganhos | Quantidade e lista dos títulos de bloco conquistados (D42), com a data |
| Atividades entregues | Quantidade de entregas enviadas, separada por situação: aprovadas, aguardando revisão e com ajustes solicitados. Reenvios da mesma atividade contam uma vez |
| Andamento nas trilhas | Para cada trilha que a pessoa pode acessar: percentual de itens publicados concluídos ou aprovados, blocos concluídos sobre o total, situação da entrega geral e se há prazo em atraso (D31, D50) |

Não há métrica de dias sem atividade nem prazo de inatividade (D47).

**Por evento de trilha (agregado, D49):**

| Métrica | Definição |
|---|---|
| Taxa de conclusão | Membros designados no evento que concluíram a trilha ÷ membros designados no evento (D32) |
| Concluíram no período | Quantos concluíram até a data de conclusão do evento (Suposição) |
| Iniciaram | Quantos designados iniciaram ao menos um item da trilha |

Uma trilha sem evento mostra só quantas pessoas concluíram e iniciaram, sem taxa: sem um grupo
designado não há denominador confiável.

**Regras gerais:**

- Calculadas a partir dos registros da plataforma (progresso, entregas, revisões, XP, títulos,
  eventos); não exigem coletar dados novos.
- Consideram só contas ativas; contas ocultas do ranking (D35), como as de teste, ficam fora dos
  agregados.
- Mudanças de conteúdo não reescrevem o passado: um item arquivado deixa de contar no
  percentual futuro, mas títulos e XP já conquistados permanecem (D26).

## 9. Requisitos não funcionais
- RNF-01 Segurança: autorização no servidor e políticas no banco; não depender apenas da UI.
- RNF-02 Privacidade: coletar somente dados necessários e limitar visibilidade por papel. Os dados servem ao acompanhamento e a planos de ação personalizados, sem relação específica com promoção, e podem ser analisados para perceber desengajamento (D47).
- RNF-03 Integridade: operações críticas em transações e protegidas contra duplicidade.
- RNF-04 Auditabilidade: revisões, recompensas, correções e mudanças de papel com histórico.
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
- Acompanhamento individual e taxa de conclusão por trilha: ver RB-09 (D48).
- Aplicação prática: evidências de uso das competências em projetos reais, se houver dados comparáveis.

Não definir metas numéricas sem linha de base. Métricas são indicadores, não prova causal automática de impacto.

## 11. Critério de sucesso do MVP
O MVP é funcional quando um usuário convidado consegue completar uma trilha de demonstração do início ao fim; uma entrega relevante pode ser assumida e revisada por um responsável elegível; uma aprovação atualiza a competência e concede XP sem duplicidade; e a gerência consegue ver o progresso e a fila de revisão.

## 12. Decisões
Decisões tomadas e em aberto ficam em `docs/product/DECISIONS.md`. Este PRD não mantém lista paralela.
