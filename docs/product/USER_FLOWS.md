# Fluxos de usuário — NPCP Academy

## Fluxo A: primeiro acesso
1. Gerência cria convite para o e-mail do membro.
2. Membro abre link válido.
3. Sistema valida token, validade e estado do convite.
4. Membro cria credencial/conta e aceita os termos de uso internos aplicáveis.
5. Convite é consumido.
6. Membro acessa catálogo de trilhas.

Casos de erro: token inválido, expirado, revogado ou usado; conta já existente; falha de rede.

## Fluxo B: atividade autodeclarada
1. Membro abre trilha e atividade.
2. Consulta instruções, links e critério de conclusão.
3. Inicia atividade.
4. Sistema registra progresso.
5. Membro marca como concluída.
6. Backend verifica elegibilidade e concede XP uma única vez.
7. Progresso e nível são atualizados.

## Fluxo C: entrega com revisão
1. Membro abre atividade prática.
2. Inicia atividade e prepara evidência (URL, texto ou referência permitida).
3. Envia a submissão.
4. Submissão entra na fila compartilhada.
5. Revisor elegível assume a submissão.
6. Revisor analisa os critérios e aprova ou solicita ajustes.
7. Sistema registra decisão, autor da revisão, horário e feedback.
8. Se aprovada, sistema atualiza progresso, competência quando aplicável e XP.
9. Se ajustes forem solicitados, membro consulta feedback e envia nova versão.

## Fluxo D: revisão compartilhada
1. Revisor abre a fila.
2. Seleciona uma submissão não atribuída.
3. Backend faz atribuição atômica se a submissão ainda estiver disponível.
4. Se outro revisor já assumiu, a operação falha de forma clara e a fila atualiza.
5. Revisor pode liberar ou concluir a revisão conforme política.
6. Gerência pode monitorar idade das submissões e reatribuir quando permitido.

## Fluxo E: gestão de conteúdo
1. Usuário com permissão cria ou edita trilha.
2. Define módulos e atividades.
3. Define competências, modo de conclusão, critério e XP.
4. Salva como rascunho e pré-visualiza.
5. Publica.
6. Conteúdo fica disponível a membros sem alterar o histórico de atividades já realizadas.

## Fluxo F: visão gerencial
1. Gerência seleciona trilha ou período.
2. Consulta adoção, progresso, competências demonstradas e fila de revisão.
3. Identifica atividades com baixa conclusão ou revisões atrasadas.
4. Decide se ajusta conteúdo, critérios, carga de revisão ou apoio aos membros.

## Regras de UX
- Sempre mostrar o estado atual e a próxima ação disponível.
- Diferenciar “atividade concluída” de “entrega aprovada”.
- Explicar por que uma competência mudou de estado.
- Exibir feedback de revisão junto à submissão correspondente.
- Não apresentar XP como sinônimo de proficiência.
