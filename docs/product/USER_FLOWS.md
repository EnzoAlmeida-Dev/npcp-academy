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
| Dashboard | `/dashboard` | member | Implementada (conteúdo provisório) |
| Trilhas → módulos → atividades | `/paths` | member | Planejada (Fase 3) |
| Competências | `/competencies` | member | Planejada (Fase 6) |
| Perfil, XP e ranking | a definir | member | Planejada (Fase 6) |
| Fila de revisão | `/reviews` | reviewer | Planejada (Fase 5) |
| Gestão de conteúdo | a definir | reviewer | Planejada (Fase 3) |
| Convites | `/admin/invitations` | manager | Implementada |
| Usuários | `/admin/users` | manager | Implementada (papel, desativar, reativar) |
| Painel gerencial | a definir | manager | Planejada (Fase 7) |

## Fluxo A: primeiro acesso
1. Gerência cria convite para o e-mail e o papel do novo usuário e copia o link (D5, D7).
2. Usuário abre o link; o sistema valida token, validade e estado do convite e mostra o e-mail convidado (somente leitura).
3. Usuário define a senha (mínimo de 8 caracteres, D36) e cria a conta.
4. Supabase envia e-mail de confirmação; o usuário confirma pelo link (D22).
5. O sistema consome o convite e ativa a conta com o papel do convite. Se a confirmação for aberta em outro dispositivo, o consumo ocorre no próximo login ou ao reabrir o link do convite.
6. Usuário define o nome de exibição, se ainda não o fez (D28).
7. Usuário aceita os termos de uso aplicáveis (D34, aberta).
8. Usuário acessa o catálogo de trilhas.

Casos de erro: token inválido, expirado, revogado ou usado; e-mail da conta diferente do convite; conta já existente; falha de rede. Mensagens públicas não revelam se um e-mail tem conta.

## Fluxo B: atividade de conteúdo (autodeclarada)
1. Membro abre uma trilha desbloqueada e uma atividade de conteúdo.
2. Consulta instruções, links e critério de conclusão.
3. Inicia a atividade; o sistema registra progresso e marca competências associadas como "em desenvolvimento" (D10).
4. Membro marca como concluída.
5. Se a atividade for elegível, o backend concede XP uma única vez (D15).
6. Progresso e nível são atualizados.

## Fluxo C: entrega com revisão
1. Membro abre uma atividade de exercício, projeto ou avaliação (D24).
2. Inicia a atividade (competências associadas vão para "em desenvolvimento") e prepara a evidência: URL e/ou texto (D25).
3. Envia a submissão; ela entra na fila compartilhada.
4. Revisor elegível assume a submissão.
5. Revisor analisa os critérios e aprova ou solicita ajustes, com feedback.
6. Sistema registra decisão, revisor, horário e feedback.
7. Se aprovada: atividade concluída, competências associadas "demonstradas" (D11) e XP concedido se elegível.
8. Se ajustes forem solicitados: membro consulta o feedback e envia nova versão (D4).

## Fluxo D: revisão compartilhada
1. Revisor abre a fila.
2. Seleciona uma submissão não atribuída e que não seja sua.
3. Backend faz atribuição atômica se a submissão ainda estiver disponível.
4. Se outro revisor já assumiu, a operação falha de forma clara e a fila atualiza.
5. Revisor conclui a revisão ou libera a submissão.
6. Gerência monitora a idade das submissões e pode liberar ou reatribuir submissões paradas (D19). Não há prazo de revisão.

## Fluxo E: gestão de conteúdo
1. Responsável técnico ou gerente cria ou edita uma trilha (D23).
2. Define módulos, atividades e pré-requisitos da trilha (D27).
3. Define tipo, competências, critérios e XP de cada atividade.
4. Salva como rascunho e pré-visualiza.
5. Publica.
6. O conteúdo fica disponível a membros sem alterar o histórico de atividades já realizadas (D26).

## Fluxo F: visão gerencial
1. Gerência seleciona trilha ou período.
2. Consulta adoção, progresso, competências demonstradas e fila de revisão.
3. Identifica atividades com baixa conclusão ou revisões paradas.
4. Decide se ajusta conteúdo, critérios, carga de revisão ou apoio aos membros.

## Fluxo G: gestão de usuários e repasse de papéis
1. Gerência abre a lista de usuários.
2. Altera o papel de um usuário (por exemplo, para repassar gerência ou responsabilidade técnica à próxima leva, D21).
3. Desativa a conta de quem deixou o núcleo ou reativa uma conta desativada (D9).
4. O sistema impede alterar o próprio papel e rebaixar ou desativar o último gerente ativo (D29), e registra autor e data de cada mudança.

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
