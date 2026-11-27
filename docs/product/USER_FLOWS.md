# Fluxos de usuário — NPCP Academy

Referências `Dnn` apontam para `DECISIONS.md`. A navegação apenas reflete as permissões; a autorização real é feita no servidor e no RLS.

## Mapa de navegação por papel

| Área | Rota | Papel mínimo | Estado |
|---|---|---|---|
| Login | `/login` | público | Implementada |
| Aceite de convite | `/invite/[token]` | público (link) | Implementada |
| Confirmação de e-mail e recuperação | `/auth/confirm` | público (link) | Implementada |
| Esqueci a senha | `/forgot-password` | público | Implementada |
| Nova senha | `/reset-password` | sessão (link de recuperação ou logado) | Implementada |
| Boas-vindas (nome obrigatório) | `/welcome` | member ativo sem nome | Implementada |
| Meu perfil | `/profile` | member | Implementada |
| Dashboard | `/dashboard` | member | Implementada (primeiros passos; visão geral para a gerência) |
| Trilhas → blocos → itens | `/paths` | member | Planejada (Fase 3) |
| CRUD de trilhas | a definir | reviewer | Planejada (Fase 3) |
| Competências | `/competencies` | member | Planejada (Fase 6) |
| Perfil, XP e ranking | a definir | member | Planejada (Fase 6) |
| Fila de revisão | `/reviews` | reviewer | Planejada (Fase 5) |
| Gestão de conteúdo | a definir | reviewer | Planejada (Fase 3) |
| Convites | `/admin/invitations` | manager | Implementada |
| Usuários | `/admin/users` | manager | Implementada (papel, vínculo, desativar, reativar) |
| Painel gerencial | a definir | manager | Planejada (Fase 7) |

## Fluxo A: primeiro acesso
1. Gerência cria convite para o e-mail, o papel e o vínculo (trainee ou efetivado) do novo usuário e copia o link (D5, D7, D44).
2. Usuário abre o link; o sistema valida token, validade e estado do convite e mostra o e-mail convidado (somente leitura).
3. Usuário define a senha (mínimo de 8 caracteres, D36) e cria a conta.
4. Supabase envia e-mail de confirmação; o usuário confirma pelo link (D22).
5. O sistema consome o convite e ativa a conta com o papel do convite. Se a confirmação for aberta em outro dispositivo, o consumo ocorre no próximo login ou ao reabrir o link do convite.
6. Usuário define o nome de exibição, se ainda não o fez (D28).
7. Usuário lê e aceita os termos de uso e o aviso de privacidade vigentes; o aceite registra versão e data (D34). Sem aceite, não segue.
8. Usuário acessa o catálogo de trilhas.

Casos de erro: token inválido, expirado, revogado ou usado; e-mail da conta diferente do convite; conta já existente; falha de rede. Mensagens públicas não revelam se um e-mail tem conta.

## Fluxo B: vídeo (autodeclarado)
1. Membro abre uma trilha disponível e um bloco. Todos os blocos da trilha estão liberados (D33); itens ou blocos em atraso aparecem sinalizados (D31).
2. Abre o vídeo (link externo, prioritariamente YouTube).
3. Marca o vídeo como concluído; competências associadas vão para "em desenvolvimento" (D10).
4. O backend concede o XP de vídeo uma única vez (D41).

## Fluxo C: entregas com revisão
Vale para questão aberta (texto), entrega por link (URL), entrega final do bloco e entrega
geral da trilha (D40).
1. Membro abre o item e prepara a resposta ou o link.
2. Envia a submissão; ela entra na fila compartilhada.
3. Revisor elegível assume, analisa os critérios e aprova ou solicita ajustes, com feedback.
4. Se aprovada: item concluído, competências associadas "demonstradas" (D11) e XP do tipo
   concedido (D41).
5. Se ajustes forem solicitados: membro consulta o feedback e envia nova versão (D4).
6. Quando todos os itens do bloco estão concluídos ou aprovados, o bloco é concluído e o
   membro conquista o título do bloco (D32, D42).
7. Com todos os blocos concluídos e a entrega geral aprovada, a trilha é concluída e concede
   o XP de conclusão (D32, D41).

## Fluxo D: revisão compartilhada
1. Revisor abre a fila.
2. Seleciona uma submissão não atribuída e que não seja sua.
3. Backend faz atribuição atômica se a submissão ainda estiver disponível.
4. Se outro revisor já assumiu, a operação falha de forma clara e a fila atualiza.
5. Revisor conclui a revisão ou libera a submissão.
6. Gerência monitora a idade das submissões e pode liberar ou reatribuir submissões paradas (D19). Não há prazo de revisão.

## Fluxo E: gestão de conteúdo (CRUD de trilhas)
1. Responsável técnico ou gerente cria ou edita uma trilha e escolhe quais vínculos podem acessá-la e quais trilhas são pré-requisito (D23, D27, D43, D44).
2. Cria e ordena os blocos, com o título que cada um concede (D42).
3. Cria os itens de cada bloco (tipo, enunciado, links, critérios de aprovação, competências)
   e a entrega geral da trilha. O XP vem da tabela por tipo, não do item (D41).
   Define, no evento, a data de conclusão (prazo da trilha) e prazos opcionais por bloco (D31, D50).
   Cria eventos da trilha, com nome, período e membros designados (D49).
4. Salva como rascunho e pré-visualiza.
5. Publica.
6. O conteúdo fica disponível a membros sem alterar o histórico de atividades já realizadas (D26).

## Fluxo F: acompanhamento (gerência e responsáveis técnicos)
1. Gerência ou responsável técnico abre o dashboard e seleciona trilha ou período.
2. Consulta a taxa de conclusão de cada evento de trilha, a fila de revisão e, por membro, nível, títulos, atividades entregues e andamento nas trilhas (RB-09, D48, D49).
3. Identifica atividades com baixa conclusão, revisões paradas e membros com pouco avanço em relação ao evento da trilha (D47, D49).
4. Decide se ajusta conteúdo, critérios, carga de revisão ou o apoio e o plano de ação de cada membro.

## Fluxo G: gestão de usuários e repasse de papéis
1. Gerência abre a lista de usuários.
2. Altera o papel de um usuário (por exemplo, para repassar gerência ou responsabilidade técnica à próxima leva, D21).
3. Desativa a conta de quem deixou o núcleo ou reativa uma conta desativada (D9).
4. Efetiva um trainee, alterando o vínculo para efetivado: ele passa a acessar todas as trilhas, com progresso, XP e títulos mantidos (D44).
5. O sistema impede alterar o próprio papel e rebaixar ou desativar o último gerente ativo (D29), e registra autor e data de cada mudança.

## Fluxo H: recuperação de senha
1. Usuário abre "Esqueci a senha" no login e informa o e-mail.
2. O sistema responde com mensagem genérica, independentemente de o e-mail existir.
3. Usuário abre o link recebido **no mesmo navegador** (fluxo PKCE); `/auth/confirm` cria a sessão e leva a `/reset-password`.
4. Usuário define a nova senha e segue para o dashboard (D8).
5. Link inválido, expirado ou aberto em outro navegador leva de volta a "Esqueci a senha" com a explicação.

Usuários logados também trocam a senha por "Meu perfil" → "Alterar senha".

## Fluxo I: exclusão da própria conta (Fase 8)
1. Usuário solicita a exclusão em "Meu perfil" e confirma.
2. São apagados perfil, credenciais, progresso, submissões próprias, XP e competências (D30).
3. Revisões que a pessoa fez em entregas de outras pessoas permanecem, com o nome do autor.

## Regras de UX
- Sempre mostrar o estado atual e a próxima ação disponível.
- Mostrar por que uma trilha está bloqueada e o que a desbloqueia.
- Diferenciar "atividade concluída" de "entrega aprovada".
- Explicar por que uma competência mudou de estado.
- Exibir feedback de revisão junto à submissão correspondente.
- Não apresentar XP como sinônimo de proficiência.
