# Design System — NPCP Academy (provisório)

> Status: direção **provisória**. A identidade visual definitiva ainda não foi
> definida. Este documento orienta a implementação técnica sem fixar marca,
> cores finais, tipografia ou ícones oficiais.

## Princípios

- Plataforma interna de capacitação profissional: clara, discreta e funcional.
- Priorizar legibilidade, consistência e acessibilidade sobre efeitos visuais.
- Componentes reutilizáveis com estados explícitos.
- A interface **não** é mecanismo de segurança: autorização segue no servidor e RLS.

## Fundamentos (provisórios)

| Categoria | Direção provisória |
|---|---|
| Cor de base | Neutros (escala de cinza) para fundos e superfícies |
| Cor de acento | Uma única cor de acento para ações primárias (a definir com a marca) |
| Cores semânticas | Sucesso, erro, alerta e informativo (a definir; nunca depender só de cor) |
| Tipografia | Fonte do sistema / Geist (já no projeto); escala modular simples |
| Espaçamento | Escala base 4px (4, 8, 12, 16, 24, 32...) |
| Bordas | `rounded` discretos e consistentes |
| Elevação | Sombras leves para modais/menus |
| Modo escuro | Opcional, não obrigatório no MVP |

## Componentes e estados

Cada componente deve cobrir: `default`, `hover`, `focus`, `disabled`, `loading`
e estados de erro/vazio quando aplicável.

- `Button`, `Input`, `Select`, `Label`, `FormMessage`
- `StatusPanel` (inválido / expirado / revogado / utilizado)
- `NavBar` / `AppShell`
- `EmptyState`, `ErrorState`, `LoadingState`

## Acessibilidade

- Contraste WCAG AA; foco visível em todos os interativos.
- Navegação por teclado; rótulos (`label`) associados; mensagens compreensíveis.
- Estados de erro/sucesso anunciados via `role="alert"` quando relevante.
