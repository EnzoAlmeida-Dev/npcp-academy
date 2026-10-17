# Requisitos de segurança — NPCP Academy

## Modelo de ameaça mínimo
Proteger contra:
- usuário sem sessão acessando recursos privados;
- membro alterando dados de outro membro;
- membro elevando o próprio papel;
- cliente manipulando XP ou estado de competência;
- revisor aprovando a própria entrega;
- concorrência em revisão ou recompensa;
- vazamento de token de convite;
- exposição acidental de dados em ranking, logs ou erros;
- segredos de serviço incluídos no bundle público.

## Controles obrigatórios
1. Autenticação gerenciada por provedor confiável.
2. Autorização no servidor para toda operação privilegiada.
3. RLS no PostgreSQL/Supabase para tabelas acessíveis por clientes.
4. Chaves privilegiadas exclusivamente no servidor; nunca usar service-role key no browser.
5. Validação de entrada e verificação de URLs conforme os tipos permitidos.
6. Convites com token aleatório, uso único, expiração, revogação e armazenamento protegido.
7. Rate limiting ou controles equivalentes em autenticação, convites e operações sensíveis conforme a capacidade do provedor.
8. Transações/constraints para evitar duplicidade de XP e conflito de revisão.
9. Registro auditável de decisões e ajustes de XP.
10. Mensagens de erro sem segredos, tokens ou dados pessoais desnecessários.
11. `.env.example` com placeholders; `.env.local` fora do versionamento.
12. Testes negativos de autorização antes da publicação.

## Regras de autorização
- Member: lê conteúdo publicado, altera apenas o próprio progresso e cria/consulta as próprias submissões.
- Reviewer: além do acesso de membro, pode assumir e revisar submissões elegíveis, mas não as próprias.
- Manager: administra convites, papéis autorizados, conteúdo e relatórios.
- A política exata de acesso a dados individuais por gerência deve ser informada aos membros.
- Nenhum papel deve ser confiado apenas por valor enviado pelo cliente.

## Privacidade
- Minimizar dados pessoais; ranking deve usar nome de exibição.
- Não expor e-mails no ranking.
- Definir política para desativação e exclusão de contas antes de uso real.
- Não usar dados reais em ambientes de demonstração.
- Informar aos usuários quais dados de progresso e avaliação são visíveis à gerência.

## Checklist pré-produção
- [ ] RLS ativada e testada nas tabelas relevantes.
- [ ] Chaves privilegiadas não estão no cliente.
- [ ] Fluxos de convite e recuperação testados.
- [ ] Acesso entre usuários testado negativamente.
- [ ] XP idempotente sob requisições repetidas.
- [ ] Revisão concorrente e autoavaliação testadas.
- [ ] Política de dados e ranking definida.
- [ ] Backups/recuperação e procedimento de migração documentados.
