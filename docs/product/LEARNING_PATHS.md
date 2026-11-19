# Trilhas e gamificação — NPCP Academy

- **Versão:** 1.4 (2026-11-19), a partir da explicação do responsável do produto.
- **Status:** especificação; nada implementado. As decisões citadas (`Dnn`) estão em
  `DECISIONS.md`, que prevalece em caso de divergência.

Este documento descreve como as trilhas são organizadas, como são criadas e como a
gamificação (XP e títulos) funciona sobre elas.

## 1. Trilhas, vínculo e acesso (D39, D44)

Haverá duas trilhas principais:

| Trilha | Público |
|---|---|
| Trilha trainee | Membros trainees (obrigatória para eles) |
| Trilha geral | Principalmente membros efetivados |

**Vínculo da pessoa.** Toda conta tem um vínculo, **trainee** ou **efetivado**, independente do
papel (membro, responsável técnico, gerência), que trata de permissões. Regras:

- **Efetivado** tem acesso a todas as trilhas publicadas.
- **Trainee** precisa concluir a trilha trainee antes de acessar as demais.
- A gerência define o vínculo no convite e o altera na tela de Usuários; a efetivação é essa
  alteração, registrada em histórico com autor e data. Progresso, XP e títulos são mantidos
  (Suposição).
- Responsáveis técnicos e gerência são efetivados por padrão (Suposição).

**Público editável no CRUD.** Ao criar ou editar uma trilha, quem a mantém escolhe quais
vínculos podem acessá-la (trainee, efetivado ou ambos) e quais trilhas são pré-requisito
(D27). As regras acima são o padrão das duas trilhas principais, não uma regra fixa no código:
a trilha trainee fica aberta a trainees (e opcionalmente a efetivados), e as demais trilhas
abertas a trainees têm a trilha trainee como pré-requisito.

As trilhas **não são pré-criadas**: as duas principais serão montadas com o CRUD (seção 3).

## 2. Estrutura de uma trilha (D38, D40)

```
Trilha
├── Bloco 1
│   ├── Itens de conteúdo (vídeos, prioritariamente do YouTube)
│   ├── Mini entregas (questões abertas, links para repositórios ou outros links)
│   └── Entrega final do bloco
├── Bloco 2
│   └── ...
└── Entrega geral da trilha (link para outra plataforma, feita durante o período da trilha)
```

- **Bloco:** unidade de estudo dentro da trilha. Reúne conteúdos e mini entregas, tem
  ordem dentro da trilha e concede um **título de perfil** quando concluído (seção 5).
- **Itens do bloco**, por tipo:

| Tipo | O que a pessoa faz | Evidência | Conclusão |
|---|---|---|---|
| Vídeo | Assiste a um conteúdo externo (link, prioritariamente YouTube) | — | Autodeclarada |
| Questão aberta | Responde por escrito a uma pergunta sobre o conteúdo | Texto | Revisão por responsável técnico |
| Entrega por link | Envia um link (repositório GitHub ou outro) | URL | Revisão |
| Entrega final do bloco | Entrega que fecha o bloco | URL e/ou texto | Revisão |

- **Entrega geral da trilha:** uma por trilha, normalmente um link para outra plataforma.
  Fica disponível durante todo o período da trilha, sem esperar os blocos.
- **Quantidade:** uma trilha tem vários blocos; cada bloco tem vários vídeos, várias
  atividades (questões abertas e entregas por link) e **uma** entrega final do bloco. A
  entrega geral é única por trilha (D45).
- **Conclusão:**
  - bloco concluído = todos os itens publicados do bloco concluídos (vídeos) ou aprovados
    (entregas);
  - trilha concluída = todos os blocos concluídos **e** a entrega geral aprovada (D32).
- Vídeos são exibidos como links externos; não há integração com a API do YouTube nem do
  GitHub (fora do escopo do MVP). Assistir a um vídeo não comprova domínio técnico.
- Competências continuam associadas aos itens com entrega (D10, D11).
- **Liberação dos blocos (D33):** a pessoa tem acesso a **todos os blocos** da trilha que está
  fazendo desde o início, em qualquer ordem. Não há desbloqueio por bloco; o bloqueio existe
  só entre trilhas (D27, D44).

### Exemplo real: bloco "Git e GitHub" da trilha trainee

```
Trilha trainee (3 a 4 blocos de temas diferentes)
├── Bloco "Git e GitHub"
│   ├── Vídeos 1, 2, 3            → Atividade (geralmente questão aberta)
│   ├── Vídeos 4, 5, 6            → Atividade
│   ├── Vídeos 7, 8, 9            → Atividade
│   └── Entrega final do bloco: README bem feito em um repositório (link)
├── Outros blocos, mesmo formato
└── Entrega geral: projeto feito em paralelo aos blocos
```

Com a tabela da seção 4, esse bloco vale 9 × 100 + 3 × 300 + 1.500 = **3.300 XP** (27%
vindo de vídeos), e a trilha com 4 blocos assim, concluída, vale 4 × 3.300 + 5.000 =
**18.200 XP**, o que leva ao nível 12 (seção 4, níveis).
O intervalo de vídeos entre atividades é decisão de quem monta o bloco, não regra do sistema.

## 3. Criação e edição de trilhas (D23, D43)

Responsáveis técnicos e gerência têm um CRUD completo de trilhas, sem esqueleto pré-criado:

- criar, editar, publicar, arquivar trilhas e escolher quais vínculos (trainee, efetivado)
  podem acessar cada uma;
- criar, ordenar e editar blocos, inclusive o **título** que cada bloco concede;
- criar, ordenar e editar itens de cada bloco (tipo, enunciado, links, critérios de
  aprovação, competências associadas);
- definir a entrega geral da trilha e os pré-requisitos entre trilhas;
- criar **eventos** da trilha, com período, membros designados e prazos (seções 3.1 e 3.2);
- rascunho e publicação: membros só veem conteúdo publicado;
- editar não apaga progresso, entregas, XP ou títulos já conquistados (D26).

Os valores de XP **não** são definidos item a item no CRUD: seguem a tabela por tipo, mantida
pela gerência (D41). Para desenvolvimento e testes, só dados fictícios no banco local; nenhum
conteúdo de trilha é criado em produção por script.

### 3.1 Prazos (D31, D50)

Os prazos são definidos **no evento**, não na trilha nem no bloco:

- A **data de conclusão** do evento é o prazo da trilha e da entrega geral, para os membros
  designados àquele evento.
- O evento pode definir um **prazo próprio por bloco**, opcional. Blocos sem prazo próprio
  seguem o prazo do evento.
- Trilha **sem evento** não tem prazo.
- Regras assumidas (Suposição, ajustáveis):
  - o prazo é uma **data absoluta**, igual para todos os designados do evento, e não
    "N dias após começar";
  - o **atraso só sinaliza**: a pessoa vê o selo de atraso e os painéis contam o atraso, mas o
    envio continua permitido e o XP não é reduzido;
  - o prazo de um bloco não pode ser posterior ao prazo do evento;
  - alterar um prazo não altera o histórico de progresso, entregas ou XP.

### 3.2 Eventos de trilha (D49)

Um evento é uma rodada da trilha para um grupo definido de pessoas (por exemplo, a turma de
trainees de um semestre).

- Criado no CRUD da trilha por responsáveis técnicos e gerência, com **nome**, **data de
  início**, **data de conclusão** e **membros designados**.
- Serve para **medir**: a taxa de conclusão da trilha é calculada por evento, só entre os
  membros designados. Assim, quem tem acesso à trilha mas não está fazendo essa rodada não puxa
  a taxa para baixo.
- Serve para **controlar** quem foi designado para cada trilha.
- Cada evento tem seu prazo (seção 3.1), por isso uma trilha com várias turmas pode ter
  prazos diferentes para cada uma.
- Regras assumidas (Suposição):
  - uma trilha pode ter vários eventos, em períodos diferentes;
  - o evento não bloqueia nem libera acesso: o acesso segue o vínculo (D44);
  - só pode ser designado quem tem acesso à trilha;
  - progresso, XP e títulos são da pessoa na trilha, não do evento.
## 4. XP (D41, D13, D14)

Tudo o que compõe a trilha concede XP, uma única vez por pessoa e por item, com peso crescente
nesta ordem: vídeo < questão aberta < entrega por link < entrega final do bloco < conclusão da
trilha. Entregas com revisão só concedem XP depois de aprovadas (D41). **Não há teto de XP.**

### Tabela de XP (D13, aprovada)

| Item | XP | Proporção |
|---|---|---|
| Vídeo concluído | 100 | 1× |
| Questão aberta aprovada | 300 | 3× |
| Entrega por link aprovada | 600 | 6× |
| Entrega final do bloco aprovada | 1.500 | 15× |
| Conclusão da trilha (inclui a entrega geral aprovada) | 5.000 | 50× |

A gerência pode ajustar a tabela; mudanças valem daí em diante e não alteram XP já concedido.

**Exemplo:** um bloco com 5 vídeos, 2 questões, 1 entrega por link e a entrega final soma
500 + 600 + 600 + 1.500 = **3.200 XP**, dos quais só 16% vêm de vídeos. Uma trilha de 6 blocos
assim, concluída, soma 6 × 3.200 + 5.000 = **24.200 XP**.

**Por que esses pesos** (os números base foram multiplicados por 10 pelo responsável do
produto, mantendo as proporções):

- **Trailhead (Salesforce)**, o modelo mais parecido (trilhas, módulos, pontos e badges por
  módulo), dá 100 pontos a um quiz acertado na primeira tentativa e 500 a um desafio prático:
  a prática vale 5× a verificação de conteúdo. Aqui, a entrega final do bloco vale 5× a
  questão aberta.
- **Microsoft Learn** concede XP por unidade, módulo e trilha, com um reconhecimento a cada
  módulo concluído: o mesmo desenho em camadas (itens, bloco com título, trilha).
- **Vídeos valem pouco** por serem autodeclarados: reduz o incentivo a marcar sem assistir e
  mantém o XP ligado ao que uma pessoa validou. XP não é medida de proficiência.

**Para calibrar depois:** com dados do piloto. Se o XP vier quase todo de vídeos, reduzir o
peso do vídeo; se ninguém concluir blocos, rever o peso da entrega final.

### Níveis (D14)

Os níveis dependem **só do XP total**. Não há nível máximo: a tabela de limites é editável pela
gerência e pode ser estendida.

**XP mínimo do nível n = 125 × n × (n − 1).** Subir do nível n para o n + 1 custa 250 × n XP,
então cada nível custa um pouco mais que o anterior, mas o primeiro vem rápido. Os limites
são **metade** da primeira proposta (250 × n × (n − 1)), por decisão do responsável do produto,
para dar mais margem de subida de nível em blocos com poucos vídeos.

| Nível | XP mínimo | Nível | XP mínimo |
|---|---|---|---|
| 1 | 0 | 9 | 9.000 |
| 2 | 250 | 10 | 11.250 |
| 3 | 750 | 11 | 13.750 |
| 4 | 1.500 | 12 | 16.500 |
| 5 | 2.500 | 13 | 19.500 |
| 6 | 3.750 | 14 | 22.750 |
| 7 | 5.250 | 15 | 26.250 |
| 8 | 7.000 | 20 | 47.500 |

**O que isso significa na prática:**

- 3 vídeos já levam ao nível 2 (300 XP) e 8 vídeos ao nível 3.
- O bloco "Git e GitHub" (3.300 XP) leva ao **nível 5**.
- Um bloco curto, com 3 vídeos, 1 questão e a entrega final (2.100 XP), leva ao **nível 4**:
  com a curva anterior ficaria no 3.
- Uma trilha completa de 4 blocos (18.200 XP) leva ao **nível 12**; duas trilhas assim
  (36.400 XP) levam ao nível 17.
- O nível 15 exige o equivalente a cerca de uma trilha e meia.

**Referências e limites da comparação:**

- **Trailhead** publica degraus de pontos para seus ranks: 200, 3.000, 9.000, 18.000, 35.000
  e 50.000. Aqui há mais níveis (e sem fim), então a comparação não é um a um. Os pontos de
  contato: o nível 9 (9.000) coincide com o degrau de 9.000 do Trailhead, e a curva fica
  **mais generosa** que a do Trailhead nos níveis altos: 18.000 XP aqui valem o nível 12, e
  lá é o quarto degrau.
- **Microsoft Learn** não publica tabela de níveis. As faixas **não confirmadas** em fóruns
  (iniciante até cerca de 5.000 XP, intermediário até 20.000, avançado até 50.000) ficariam
  aproximadamente nos níveis 6, 13 e 20.
- A fórmula quadrática dá **ganho rápido no começo** (motivação para quem está começando, em
  geral trainees) e **ritmo mais lento depois**, comum em sistemas de nível por XP.
- Os níveis se chamam apenas "Nível n" por ora; nomes são decisão futura, sem efeito nas regras.

A curva é uma suposição a revisar com dados reais do piloto: se todos subirem de nível rápido
demais, aumentar o fator (125) sem mudar o resto.

## 5. Títulos de perfil (D42)

- Cada bloco concede um título, definido por quem cria o bloco (ex.: "Fundamentos de Git").
- O título é conquistado uma única vez, ao concluir o bloco, e nunca é retirado
  automaticamente; correções seguem a regra de eventos auditáveis (D12, D16).
- Uso:
  - **Perfil:** compõe a personalização do perfil. A pessoa escolhe um título conquistado para
    exibir.
  - **Ranking geral:** mostra o título escolhido ao lado do nome, do nível e do XP (D20).
  - **Painel de usuários e dashboards** de responsáveis técnicos e gerência: títulos
    conquistados por pessoa, uma das métricas de acompanhamento (RB-09 no PRD, D48).
- Títulos são conquistas de percurso, não certificação (RF-31 segue fora do escopo).

## 6. Em aberto

| ID | Questão |
|---|---|
| D34 | Termos de uso e aviso de privacidade: o texto (em fase de testes) está em `TERMS_AND_PRIVACY.md`; recomenda-se revisão jurídica antes de abrir a todos os membros. |
| — | Nomes dos níveis (opcional, sem efeito nas regras). |

Fontes da recomendação de XP e níveis:
[Trailhead — Plan your strategy for ranking up](https://trailhead.salesforce.com/content/learn/modules/trailhead-road-to-ranger/plan-your-strategy-for-ranking-up),
[Salesforce — Learn skills, earn Trailhead Ranger rank](https://www.salesforce.com/blog/learn-skills-earn-trailhead-ranger-rank/),
[Microsoft Learn — FAQ](https://learn.microsoft.com/en-us/training/support/faq),
[Microsoft Q&A — What are the different XP levels in Learn?](https://learn.microsoft.com/en-us/answers/questions/1350537/what-are-the-different-xp-levels-in-learn).
