# Design System — NPCP Academy

> **Status:** direção visual consolidada para implementação do MVP. A validação
> final da aplicação da marca institucional, dos ícones oficiais e das fontes
> deve ser registrada antes do lançamento público.

Este documento é a fonte única para as decisões de design visual e UX/UI da
plataforma. A interface deve ser clara, discreta e funcional, priorizando
legibilidade, consistência e acessibilidade sobre efeitos visuais.

## Implementação atual

- Tokens de cor, raio e sombra aplicados em `src/app/globals.css` (Tailwind v4 `@theme`).
- Fontes **Poppins** (títulos) e **Questrial** (corpo) carregadas via `next/font/google`.
- Componentes base em `src/components/ui/`: Button, Input, PasswordInput, Select, Label,
  FormMessage, Card, Badge, StatusPanel, EmptyState, ErrorState, LoadingState,
  ConfirmDialog, CopyButton, PageHeader.
- App shell com navegação por papel em `src/components/app-shell/` (sidebar fixa no
  desktop, header/menu mobile, link "Pular para o conteúdo", `<nav>` com rótulo),
  config em `src/lib/navigation.ts`.
- Ícones: **Lucide** (`lucide-react`), importando apenas os ícones usados (tree-shaking).
  Ícones são decorativos (`aria-hidden`) e sempre acompanhados de texto ou de
  `sr-only`.
- Estados de rota na área autenticada: `loading.tsx`, `error.tsx`; `not-found.tsx` global.
- Títulos por página via `metadata` (`%s · NPCP Academy`).
- Marca exibida como texto “NPCP Academy” até a definição do logo oficial (sem logo ainda).
- Contrastes verificados por `src/lib/contrast.test.ts`, que lê os tokens de
  `globals.css`; alterar uma cor que viole o mínimo quebra o teste.

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
| `primary` | `#B81825` | Ações primárias, estados ativos, links principais e destaque |
| `secondary` | `#1D3561` | Navegação, títulos, estruturas e elementos neutros fortes |
| `surface` | `#FFFFFF` | Cards, modais, campos e superfícies elevadas |
| `canvas` | `#F0F3F6` | Fundo principal da plataforma |
| `text-primary` | `#101828` | Texto principal e conteúdo de alta prioridade |
| `text-secondary` (`muted`) | `#5B6577` | Rótulos, descrições e conteúdo auxiliar (≥ 4,5:1 sobre canvas) |
| `border` | `#E4E7EC` | Bordas decorativas e divisores (cards, listas) |
| `field-border` | `#7A8599` | Borda de campos de formulário (contraste ≥ 3:1) |

O tom `#F4F6F9` pode ser usado como alternativa de fundo quando necessário
para diferenciar áreas sem criar uma nova cor de marca. Cores semânticas (implementadas): sucesso `#067647`, erro `#B42318`, alerta
`#B54708` e informativo `#175CD3`, todas com contraste WCAG AA nos badges. Devem
sempre ser acompanhadas de texto ou ícone.

**Foco:** anel de 2px em `primary` sobre superfícies claras e **branco** sobre
superfícies escuras (classe `on-dark` na sidebar e no header mobile), pois o
vermelho sobre azul tem apenas 1,8:1.

**Ações destrutivas:** o vermelho de erro é próximo do primário; a diferença vem da
forma, não do matiz: botão de contorno, ícone (`Ban`, etc.), rótulo explícito e
confirmação por `ConfirmDialog` antes de executar.

### Tipografia

- **Poppins**, em `Semi-Bold` ou `Bold`: títulos de páginas e seções, KPIs,
  cabeçalhos de tabelas e modais e texto de CTAs.
- **Questrial**, em `Regular`: corpo, descrições, inputs, placeholders,
  tabelas, tooltips, badges secundárias e menus.
- A escala tipográfica deve ser modular e responsiva, mantendo hierarquia
  perceptível entre `H1`, `H2`, `H3`, corpo, legenda e metadados.
- Se as fontes da marca não estiverem disponíveis, usar uma fonte de sistema
  equivalente sem alterar a hierarquia ou a legibilidade.

### Espaçamento, bordas e elevação

- Escala base de espaçamento de `4px`: `4`, `8`, `12`, `16`, `24`, `32` e
  múltiplos necessários.
- Cards e contêineres principais: `border-radius` entre `12px` e `16px`.
- Botões e badges: `8px` ou formato de pílula (`9999px`) quando o componente
  representar um status ou uma ação compacta.
- Cards, modais e painéis flutuantes usam elevação suave:
  `0 10px 25px rgba(0, 0, 0, 0.08)`.
- O modo escuro não faz parte do MVP e não deve ser implementado parcialmente.

## Estrutura da interface

### App shell e navegação

- A navegação principal usa uma `Sidebar` ou `Header` em `#1D3561`.
- O texto da navegação é branco ou cinza claro.
- O item ativo usa `#B81825` como indicador visual, além de estado textual ou
  semântico equivalente.
- O topo deve reservar espaço para a marca institucional definida para o
  produto. O uso da marca CIMATECjr requer confirmação antes do lançamento.
- A área de conteúdo usa `#F0F3F6`, permitindo a distinção entre canvas e
  superfícies brancas.

### Ações e controles

- **Botão primário:** fundo `#B81825`, texto claro, cantos moderadamente
  arredondados.
- **Botão secundário:** fundo transparente com borda `#1D3561` ou preenchimento
  neutro.
- Ações destrutivas e estados de erro não devem reutilizar o vermelho primário
  sem diferenciação semântica.
- Tabelas, formulários, métricas e cards devem preservar alinhamento e ritmo
  baseados na escala de espaçamento.

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

- Setas e chevrons (`>` / `<`) podem indicar etapas, navegação, divisores de
  processo e detalhes laterais de cards de status.
- Ondas e formas orgânicas devem aparecer apenas como texturas sutis em banners,
  cabeçalhos ou áreas de destaque, mantendo o texto legível.
- Formas geométricas podem apoiar ícones, avatares, indicadores de progresso e
  status.
- Grafismos não devem substituir rótulos, controles, feedback ou informação
  necessária para concluir uma tarefa.

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

Estas questões não impedem a implementação do MVP, mas devem ser resolvidas e
registradas antes da publicação:

1. Confirmar a marca exibida no shell (NPCP Academy, CIMATECjr ou composição
   institucional) e obter seus ativos oficiais. **Ainda não há logo.**
2. Confirmar as famílias Poppins e Questrial e sua forma de carregamento; definir
   fallback aprovado caso não estejam disponíveis.
3. Definir a escala tipográfica numérica final e os breakpoints responsivos.
4. Grafismos (setas, ondas, formas geométricas) ainda não foram aplicados; decidir
   quais entram no MVP.
5. Validar a necessidade de modo escuro após o MVP.

Toda decisão nova deve ser incorporada neste arquivo, evitando documentos
paralelos para a mesma finalidade.
