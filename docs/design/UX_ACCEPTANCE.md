# Critérios de aceitação de UX/UI e acessibilidade

## Estados obrigatórios

- **Carregando**: feedback visível durante submissão de formulários.
- **Vazio**: mensagens claras (ex.: "Nenhum convite criado").
- **Erro**: mensagens compreensíveis e, em autenticação, **genéricas** (sem revelar
  existência de conta ou convite).
- **Sucesso**: confirmação explícita (ex.: convite criado com link; "confirme seu e-mail").
- **Sem permissão**: mensagem de acesso negado (a autorização real é no servidor/RLS).
- **Indisponível/offline**: mensagem de erro de rede sem expor detalhes técnicos.

## Acessibilidade

- Foco visível em todos os elementos interativos.
- Navegação completa por teclado.
- Rótulos (`label`) associados a campos de formulário.
- Contraste adequado (WCAG AA) e nenhuma informação dependente só de cor.
- Erros anunciados de forma compreensível (`role="alert"` quando relevante).

## Responsividade

- Fluxos principais funcionais em desktop e celular (breakpoints simples).
- Áreas de formulário com largura máxima adequada em telas pequenas.

## Definição de pronto (UX/UI)

- Componentes com estados documentados e implementados.
- Navegação por teclado e foco visível verificados manualmente.
- Contraste e rótulos revisados.
- Layout responsivo testado em ao menos dois tamanhos de tela.
