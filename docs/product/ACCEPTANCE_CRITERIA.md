# Critérios de aceitação — NPCP Academy

Cada critério deve ser validado por teste automatizado, teste manual documentado ou ambos.

## Autenticação e convites
- AC-01: Dado um convite válido e não utilizado, o usuário consegue criar conta e o convite fica consumido.
- AC-02: Um convite expirado, revogado ou utilizado não pode criar outra conta.
- AC-03: Usuário sem sessão não acessa páginas privadas nem APIs privadas.
- AC-04: Um membro não consegue executar ações administrativas alterando URLs ou chamadas HTTP.
- AC-05: Segredos privilegiados não aparecem no bundle do cliente, logs públicos ou repositório.

## Trilhas e conteúdo
- AC-06: Um membro vê apenas trilhas publicadas.
- AC-07: Um responsável autorizado consegue criar, editar, salvar como rascunho e publicar uma trilha.
- AC-08: Uma trilha pode conter módulos e cada módulo pode conter atividades ordenadas.
- AC-09: Uma atividade exibe instruções, tipo, critérios, links externos e competências associadas.
- AC-10: Alterar uma atividade não apaga o histórico de progresso e submissões já existentes.

## Progresso e submissões
- AC-11: Cada usuário mantém progresso independente por atividade.
- AC-12: Atividade autodeclarada pode ser concluída conforme sua regra de negócio e não exige revisão manual.
- AC-13: Atividade que exige revisão não é aprovada apenas por autodeclaração.
- AC-14: O membro pode enviar evidência e consultar seu estado e feedback.
- AC-15: Reenvios mantêm o histórico e não duplicam o registro de progresso.
- AC-16: O usuário A não consegue consultar ou alterar submissões privadas do usuário B.

## Fila de revisão
- AC-17: Submissão pendente aparece na fila compartilhada de revisores elegíveis.
- AC-18: Dois revisores tentando assumir a mesma submissão simultaneamente resultam em apenas uma atribuição válida.
- AC-19: Revisor pode aprovar ou solicitar ajustes, registrando feedback.
- AC-20: O autor não pode revisar a própria entrega.
- AC-21: Revisão guarda revisor, data, decisão e feedback.
- AC-22: Ações não autorizadas ou transições inválidas são rejeitadas pelo servidor.

## Competências
- AC-23: Competência pode estar em um dos três estados definidos.
- AC-24: Iniciar atividade pode marcar competência como “em desenvolvimento” segundo regra documentada.
- AC-25: Competência só passa para “demonstrada” após evidência aprovada que satisfaça critério configurado.
- AC-26: A origem da evidência que fundamentou uma competência demonstrada pode ser consultada por usuários autorizados.
- AC-27: Alterar uma atividade não apaga evidências de competências anteriores.

## XP, níveis e ranking
- AC-28: Recompensa elegível é registrada no histórico de XP.
- AC-29: Repetir a mesma requisição não duplica a recompensa.
- AC-30: O cliente não pode determinar livremente valor, usuário destinatário ou evento de XP.
- AC-31: Correção de pontuação gera transação corretiva com motivo e autor autorizado.
- AC-32: Nível é calculado conforme limites documentados.
- AC-33: Ranking é ordenado por XP, usa regra estável para empates e não expõe dados desnecessários.
- AC-34: Recompensa de aprovação ocorre somente após a aprovação persistida com sucesso.

## Painel e implantação
- AC-35: Gerência autorizada consegue consultar progresso agregado por trilha.
- AC-36: Responsáveis conseguem ver a fila de revisão sem acessar dados além das permissões concedidas.
- AC-37: Interface principal funciona em desktop e celular.
- AC-38: Estados de carregamento, erro, vazio e sucesso são apresentados de forma compreensível.
- AC-39: Build, lint, checagem de tipos e testes relevantes passam na CI ou no procedimento documentado.
- AC-40: Um README explica configuração, variáveis de ambiente, migrações, seeds e implantação.

## Testes negativos obrigatórios
- Membro tenta publicar uma trilha.
- Membro tenta aprovar submissão.
- Revisor tenta aprovar a própria entrega.
- Usuário tenta ler submissão de outra pessoa por ID direto.
- Cliente tenta alterar papel, XP ou estado de competência.
- Duas requisições concorrentes tentam assumir a mesma revisão.
- Uma requisição de recompensa é repetida.
- Um convite expirado ou já usado é reapresentado.
