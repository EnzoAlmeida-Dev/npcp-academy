# Design System — NPCP Academy

> **Status:** direção visual consolidada e aplicada em todas as telas atuais
> (revisão de 2026-11-05). A marca segue sem logo oficial; a validação final da
> marca institucional deve ser registrada antes do lançamento público.

Este documento é a fonte única para as decisões de design visual e UX/UI da
plataforma.

## Direção visual

Modern Learning SaaS: aparência de software técnico, base neutra e superfícies
bem acabadas. Inspirações, não modelos a copiar: **Linear** (tipografia, sidebar,
espaçamento, hover), **Brilliant** (progresso e navegação por etapas) e **Vercel**
(superfícies, contrastes, faixas de indicadores).

Três ideias tornam a interface própria do NPCP Academy:

1. **Cor com função.** Vermelho significa "faça isto" (ação principal, item ativo).
   Azul significa "onde você está" (progresso, foco, links). O resto é grafite e
   cinza. Evitar grandes áreas de vermelho e azul na mesma vista: cada tela tem no
   máximo uma ação em vermelho em destaque.
2. **Chevrons como progresso.** Trilhas se liberam em série (D27), e o progresso é
   desenhado como essa sequência, em vez de barras ou anéis genéricos. É o elemento
   marcante: aparece grande no painel de login e pequeno nos indicadores.
3. **Superfícies em camadas, não grade de cards.** Moldura cinza, folha de conteúdo
   rebaixada, e cards só onde há um grupo real. Listas são linhas contínuas;
   indicadores são uma única faixa dividida.

**Regra de dados:** nada de números, cursos ou gráficos ilustrativos. Tudo que
aparece vem do banco; o que depende de fases futuras fica como estado vazio ou
bloqueado, com o motivo.

## Implementação atual

- Tokens em `src/app/globals.css` (Tailwind v4 `@theme`); fontes via `next/font/google`.
- Componentes em `src/components/ui/`: Button (`variant`, `size`), Input, PasswordInput,
  Select (`compact`), Label, FormMessage, Card (`flush`), Badge, Avatar, StatusPanel,
  EmptyState, ErrorState, LoadingState (esqueleto), ConfirmDialog, CopyButton, PageHeader,
  SectionTitle, ProgressChevrons, StepList, StatStrip, SegmentedBar.
- `src/components/app-shell/`: AppShell, NavList (grupos Aprender, Revisar, Administrar;
  título do grupo só aparece com mais de um), UserMenu, MobileNav e AuthLayout.
- Ícones: **Lucide**, importando apenas os usados. Decorativos (`aria-hidden`) e sempre
  acompanhados de texto ou `sr-only`.
- Estados de rota: `loading.tsx`, `error.tsx`, `not-found.tsx`. Títulos via `metadata`.
- Marca como texto “NPCP Academy” (Poppins Semi-Bold); **ainda sem logo**.
- Contrastes e a escala de papéis verificados por `src/lib/contrast.test.ts`, que lê
  `globals.css`: alterar uma cor que viole o mínimo quebra o teste.

## Princípios

- Plataforma interna de capacitação profissional, com hierarquia visual clara.
- Componentes reutilizáveis, previsíveis e com estados explícitos.
- A interface não é mecanismo de segurança: autorização continua no servidor e
  no banco de dados.
- Nunca comunicar estado apenas por cor; combinar cor com texto, ícone ou forma.
- Usar padrões geométricos e grafismos como apoio, sem prejudicar conteúdo,
  contraste ou desempenho.

## Tokens visuais

### Cores

| Token | Valor | Uso |
|---|---|---|
| `primary` | `#B81825` | Ação principal, ícone do item ativo; hover `#A0131F` |
| `secondary` | `#1D3561` | Progresso, foco, links; **não** é mais cor de navegação nem de títulos |
| `canvas` | `#EEEEF0` | Moldura: fundo da sidebar e da aplicação |
| `sheet` | `#FAFAFA` | Folha de conteúdo e hover de linhas |
| `surface` | `#FFFFFF` | Cards, modais, campos, telas de autenticação |
| `ink` | `#1C1D21` | Texto principal, títulos, painel grafite, avatar |
| `muted` | `#5C5E66` | Texto secundário (≥ 4,5:1 em todas as superfícies) |
| `on-ink-muted` | `#A9ABB3` | Texto secundário sobre o painel grafite |
| `border` / `border-strong` | `#E4E4E7` / `#D4D4D8` | Divisórias e contornos de botões |
| `field-border` | `#84868E` | Borda de campos (≥ 3:1) |
| `track` | `#DCDDE2` | Parte vazia de indicadores e esqueletos |

Cores semânticas: sucesso `#067647`, erro `#B42318`, alerta `#B54708`, informativo
`#175CD3`. Aparecem em ícones, texto de erro e no ponto dos badges; o fundo do badge é
neutro e o estado está sempre no texto.

**Escala de papéis** (`role-member` `#7A92BC`, `role-reviewer` `#4D6A9F`, `role-manager`
`#1D3561`): sequencial, um só azul do claro ao escuro, porque os papéis têm ordem. Não é
paleta categórica: sempre com legenda e valores em texto.

**Foco:** anel de 2px em `secondary`, regra global em `globals.css`. Vermelho no foco se
confundiria com erro e com a ação principal.

**Ações destrutivas:** o vermelho de erro é próximo do primário; a diferença vem da
forma: botão de contorno com texto vermelho e ícone, nunca preenchido na lista, e
confirmação por `ConfirmDialog` antes de executar.

### Tipografia

- **Poppins** para títulos, indicadores, CTAs e a marca: `Semi-Bold`, com `Medium` só nas
  iniciais do avatar. Sempre com tracking fechado (`tracking-tight`).
- **Questrial** `Regular` para corpo, navegação, campos, listas e badges. Tem um único
  peso: a hierarquia no corpo vem de cor (`ink` × `muted`) e tamanho, nunca de negrito.
- Sem rótulos em maiúsculas nem palavra destacada dentro de título.
- Escala: 12 (`text-xs`), 13 (`text-ui`), 14 (`text-sm`), 16 (`text-base`, títulos de
  seção), 24 (`text-2xl`, títulos de página), 30 (`text-3xl`, saudação e indicadores) e
  36 (`text-4xl`, painel de login).

### Espaçamento, bordas e elevação

- Escala de `4px`. Breakpoints: `sm` (640px) e `lg` (1024px, em que a sidebar aparece).
- O raio segue a hierarquia: folha `16px`, card `12px`, controles `8px`, badges em pílula.
- Profundidade discreta: cards com borda `border` e sombra `0 1px 2px` (`shadow-card`);
  só diálogos e menus flutuantes têm sombra forte (`shadow-overlay`).
- O modo escuro não faz parte do MVP e não deve ser implementado parcialmente.

### Movimento

- Respostas a ações: 150ms em cor e borda; botões descem 1px ao pressionar; diálogo e
  menu entram em 140–160ms.
- Único movimento espontâneo: os chevrons preenchidos entram em sequência ao carregar.
- `prefers-reduced-motion` desativa tudo (regra global).

## Estrutura da interface

### App shell e navegação

- Desktop: sidebar de `240px` sem fundo próprio, sobre a moldura, fixa ao rolar. O
  conteúdo é uma folha rebaixada com margem de 8px, largura máxima de texto `max-w-5xl`.
- Item ativo: superfície branca com borda e ícone em `primary`, além de `aria-current`.
  Itens futuros ficam em `muted` com "Em breve" e não são interativos.
- Rodapé da sidebar: avatar, nome e papel levam a Meu perfil; ao lado, o botão de sair.
- Celular: barra superior fixa com a marca e o menu, que fecha com Esc ou clique fora.
- Telas fora da área logada (`AuthLayout`): painel grafite com os chevrons e a frase do
  produto, coluna branca com o formulário; no celular, o painel vira uma faixa.
- O uso da marca CIMATECjr requer confirmação antes do lançamento.

### Ações e controles

- **Primário:** fundo `primary`, texto branco. Um por vista, em destaque.
- **Secundário:** fundo branco, contorno neutro, texto `ink`.
- **Destrutivo:** ver "Ações destrutivas".
- Controles têm `40px` de altura; `32px` (`size="sm"`, `compact`) dentro de linhas de lista.
- Listas: linhas contínuas em um `Card flush`, com hover em `sheet`.

### Padrões para as próximas fases

Componentes já prontos para a Fase 3 em diante, sem dados fictícios até lá:

- **Trilha no catálogo:** `ProgressChevrons` com um segmento por módulo, texto "x de y".
- **Navegação de módulos e atividades:** `StepList` com concluída, em andamento e
  bloqueada; bloqueio sempre com o motivo, como exige o estado "Bloqueado".
- **Painel gerencial:** `StatStrip` para números e `SegmentedBar` para partes de um total.
- **XP e nível:** secundários em relação a competências e entregas; não apresentar XP como
  proficiência.

## Componentes e estados

Cada componente interativo deve definir, quando aplicável, os estados
`default`, `hover`, `focus`, `disabled`, `loading`, `error`, `empty` e
`success`.

Componentes mínimos do MVP:

- `Button`, `Input`, `Select`, `Label` e `FormMessage`;
- `StatusPanel` para itens inválidos, expirados, revogados ou utilizados;
- `NavBar`, `Sidebar` e `AppShell`;
- `EmptyState`, `ErrorState` e `LoadingState`;
- cards de conteúdo, métricas, progresso e status;
- modais e painéis flutuantes.

Mensagens de erro devem explicar o problema e, quando possível, indicar a ação
corretiva. Estados de carregamento não devem causar mudanças bruscas de layout.

### Estados obrigatórios de tela

- **Carregando:** feedback visível durante envio de formulários e carregamento.
- **Vazio:** mensagem clara e próxima ação (ex.: "Nenhum convite criado").
- **Erro:** mensagem compreensível; em autenticação, **genérica** (sem revelar
  existência de conta ou convite).
- **Sucesso:** confirmação explícita (ex.: convite criado com link; "confirme seu e-mail").
- **Sem permissão:** mensagem de acesso negado (a autorização real é no servidor/RLS).
- **Bloqueado:** item indisponível com o motivo e o que o libera (ex.: trilha com
  pré-requisito pendente).
- **Indisponível/offline:** erro de rede sem detalhes técnicos.

Ações irreversíveis (revogar, desativar) exigem `ConfirmDialog`: foco inicial em
"Cancelar", Esc e clique no fundo fecham, Tab não sai do diálogo e o foco volta ao
elemento de origem. Segredos exibidos uma única vez (link de convite) avisam isso e
oferecem botão de copiar.

## Grafismos e identidade visual

- **Chevrons** são o grafismo oficial do MVP: indicam etapas e progresso, e compõem o
  painel de autenticação.
- Ondas e formas orgânicas não entram no MVP.
- Grafismos não substituem rótulos, controles, feedback ou informação necessária para
  concluir uma tarefa: `ProgressChevrons` expõe `role="progressbar"` e vem com texto.

## Acessibilidade e comportamento responsivo

- Atender contraste WCAG AA para texto, controles e estados.
- Manter foco visível em todos os elementos interativos.
- Permitir navegação completa por teclado e ordem de foco lógica.
- Associar todo campo ao seu `label` e preservar mensagens compreensíveis.
- Anunciar erros e mudanças relevantes com `role="alert"` ou mecanismo
  equivalente, sem anunciar conteúdo excessivo.
- Garantir uso em telas pequenas sem depender de hover, largura fixa ou gesto
  exclusivo.
- Formulários com largura máxima adequada; fluxos principais funcionais em
  desktop e celular.

## Definição de pronto (UX/UI)

- Estados de tela aplicáveis implementados (ver "Estados obrigatórios de tela").
- Navegação por teclado e foco visível verificados manualmente.
- Contraste e rótulos revisados.
- Layout testado em ao menos dois tamanhos de tela (celular e desktop).
- Telas novas seguem o mapa de navegação de `docs/product/USER_FLOWS.md`;
  esboços de layout, quando necessários, acompanham a tarefa em vez de virar
  documento separado.

## Questões de design ainda abertas

1. Confirmar a marca exibida (NPCP Academy, CIMATECjr ou composição institucional) e obter
   seus ativos oficiais. **Ainda não há logo.**
2. Validar a necessidade de modo escuro após o MVP.

Toda decisão nova deve ser incorporada neste arquivo, evitando documentos
paralelos para a mesma finalidade.
