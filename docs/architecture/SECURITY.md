# Requisitos de segurança — NPCP Academy

Referências `Dnn` apontam para `docs/product/DECISIONS.md`.

## Modelo de ameaça mínimo
Proteger contra:
- usuário sem sessão acessando recursos privados;
- conta desativada usando sessão ainda válida;
- membro alterando dados de outro membro;
- usuário elevando o próprio papel ou removendo o último gerente;
- cliente manipulando XP ou estado de competência;
- revisor aprovando a própria entrega ou corrigindo o próprio XP/competência;
- concorrência em revisão ou recompensa;
- vazamento de token de convite;
- exposição acidental de dados em ranking, logs ou erros;
- segredos de serviço incluídos no bundle público.

## Controles obrigatórios
1. Autenticação gerenciada pelo Supabase Auth, com confirmação de e-mail (D22).
2. Autorização no servidor para toda operação privilegiada.
3. RLS no PostgreSQL em toda tabela acessível ao cliente; funções `security definer` com `search_path = ''` e verificação explícita de papel.
4. Chaves privilegiadas exclusivamente no servidor; nunca usar service-role no browser.
5. Validação de entrada (zod) e de URLs (`http`/`https`) em todas as fronteiras.
6. Convites com token aleatório (32 bytes), uso único, expiração, revogação e armazenamento só do hash.
7. Rate limiting nos fluxos de autenticação conforme o Supabase Auth; avaliar limites próprios em operações sensíveis.
8. Transações/constraints contra duplicidade de XP e conflito de revisão.
9. Registro auditável de revisões, ajustes de XP/competência e mudanças de papel/status.
10. Mensagens de erro sem segredos, tokens ou dados pessoais; mensagens públicas não revelam se um e-mail tem conta.
11. `.env.example` com placeholders; arquivos `.env*` reais fora do versionamento.
12. Testes negativos de autorização antes de cada publicação de funcionalidade.

## Regras de autorização
| Ação | member | reviewer | manager |
|---|---|---|---|
| Ler conteúdo publicado de trilhas desbloqueadas | ✓ | ✓ | ✓ |
| Alterar o próprio progresso, criar/consultar as próprias submissões | ✓ | ✓ | ✓ |
| Definir o próprio nome de exibição e trocar a própria senha | ✓ | ✓ | ✓ |
| Ver ranking (nome, nível, XP) | ✓ | ✓ | ✓ |
| Criar, editar, publicar e arquivar conteúdo (D23) | | ✓ | ✓ |
| Assumir, liberar e revisar submissões de outras pessoas | | ✓ | ✓ |
| Corrigir XP e competência de outras pessoas (D12, D16) | | ✓ | ✓ |
| Liberar/reatribuir submissão assumida por outro revisor (D19) | | | ✓ |
| Criar e revogar convites (D5) | | | ✓ |
| Alterar papel, vínculo (efetivação), desativar e reativar contas de outras pessoas (D9, D21, D44) | | | ✓ |
| Ocultar perfis do ranking (D35) | | | ✓ |
| Criar e gerenciar eventos de trilha e designar membros (D49) | | ✓ | ✓ |
| Ver métricas de acompanhamento dos membros e taxas de conclusão por evento (D48, RB-09) | | ✓ | ✓ |
| Consultar e-mail, histórico de conta e demais dados individuais de outros membros | | | ✓ |

Restrições que valem para todos os papéis:
- Ninguém revisa a própria entrega nem corrige o próprio XP ou competência.
- Ninguém altera o próprio papel ou vínculo nem desativa a própria conta; o último gerente ativo não pode ser rebaixado nem desativado (D29). Operações concorrentes são serializadas por bloqueio das linhas de gerentes.
- Usuário inativo ou desativado não tem papel efetivo (`current_profile_role()` retorna nulo).
- Nenhum papel, `user_id`, XP ou status enviado pelo cliente é confiado sem verificação no servidor.

## Segredos e ambientes
- `SUPABASE_SERVICE_ROLE_KEY` só é usada por scripts administrativos executados localmente (`seed:manager`). A aplicação em execução não a utiliza; não configurá-la no Vercel enquanto nenhuma funcionalidade de servidor precisar dela.
- `src/lib/supabase/admin.ts` e `src/lib/env.server.ts` importam `server-only`.
- Nenhum segredo usa prefixo `NEXT_PUBLIC_`.
- Nunca executar `db reset --linked`; `db push` remoto só com alvo identificado e confirmado.

## Privacidade
- Minimizar dados pessoais: perfil guarda apenas nome de exibição, papel e datas de status.
- Ranking e fila de revisão exibem nome de exibição, nunca e-mail.
- Dados de membros desligados são mantidos com a conta desativada (D18); a exclusão a pedido do usuário depende de D30.
- Informar aos usuários quais dados de progresso e avaliação a gerência vê (D34).
- Não usar dados reais em seeds, testes ou demonstrações.

## Checklist pré-produção
- [x] RLS ativada nas tabelas atuais (`profiles`, `invitations`).
- [x] RLS e funções de contas e convites testadas por suíte automatizada (`npm run test:integration`, também no CI).
- [x] Chaves privilegiadas fora do cliente.
- [x] Fluxo de convite testado (scripts E2E).
- [ ] Fluxo de recuperação de senha implementado (falta teste manual com e-mail real em produção).
- [ ] Acesso entre usuários testado negativamente para cada nova tabela.
- [ ] XP idempotente sob requisições repetidas.
- [ ] Revisão concorrente e autoavaliação testadas.
- [ ] Política de exclusão de conta (D30) e aviso de privacidade (D34) definidos.
- [ ] Backups/recuperação e procedimento de migração documentados.
- [ ] Senha mínima de 8 caracteres (D36): aplicação e Supabase local ajustados; falta o painel do Supabase em nuvem.
