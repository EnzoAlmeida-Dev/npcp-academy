# Design System — NPCP Academy

> **Status:** direção visual consolidada para implementação do MVP. A validação
> final da aplicação da marca institucional, dos ícones oficiais e das fontes
> deve ser registrada antes do lançamento público.

Este documento é a fonte única para as decisões de design visual e UX/UI da
plataforma. A interface deve ser clara, discreta e funcional, priorizando
legibilidade, consistência e acessibilidade sobre efeitos visuais.

## Implementação atual (Etapa de design)

- Tokens de cor, raio e sombra aplicados em `src/app/globals.css` (Tailwind v4 `@theme`).
- Fontes **Poppins** (títulos) e **Questrial** (corpo) carregadas via `next/font/google`.
- Componentes base em `src/components/ui/` (Button, Input, Select, Label, FormMessage,
  Card, Badge, StatusPanel, EmptyState, PageHeader).
- App shell com navegação por papel em `src/components/app-shell/` (sidebar desktop,
  header/menu mobile), config em `src/lib/navigation.ts`.
- Marca exibida como texto “NPCP Academy” até a definição do logo oficial.

## Princípios

- Plataforma interna de capacitação profissional, com hierarquia visual clara.- Componentes reutilizáveis, previsíveis e com estados explícitos.
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
| `text-secondary` | `#667085` | Rótulos, descrições e conteúdo auxiliar |
| `border` | `#E4E7EC` | Bordas e divisores |

O tom `#F4F6F9` pode ser usado como alternativa de fundo quando necessário
para diferenciar áreas sem criar uma nova cor de marca. Cores semânticas de
sucesso, erro, alerta e informativo devem ser definidas com contraste WCAG AA e
sempre acompanhadas de uma indicação não visual.

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

## Questões de design ainda abertas

Estas questões não impedem a implementação do MVP, mas devem ser resolvidas e
registradas antes da publicação:

1. Confirmar a marca exibida no shell (NPCP Academy, CIMATECjr ou composição
   institucional) e obter seus ativos oficiais.
2. Confirmar as famílias Poppins e Questrial e sua forma de carregamento; definir
   fallback aprovado caso não estejam disponíveis.
3. Definir a escala tipográfica numérica final e os breakpoints responsivos.
4. Definir os tokens de sucesso, erro, alerta e informativo com seus estados
   claro/escuro e critérios de contraste.
5. Selecionar a biblioteca ou conjunto de ícones e suas regras de uso.
6. Validar a necessidade de modo escuro após o MVP.

Toda decisão nova deve ser incorporada neste arquivo, evitando documentos
paralelos para a mesma finalidade.
