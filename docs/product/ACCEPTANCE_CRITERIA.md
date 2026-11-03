# Critérios de aceitação — NPCP Academy

Cada critério deve ser validado por teste automatizado, teste manual documentado ou ambos. O estado de cobertura de cada critério fica em `docs/implementation/STATUS.md`. Referências `Dnn` apontam para `DECISIONS.md`.

## Autenticação, convites e contas
- AC-01: Dado um convite válido e não utilizado, o usuário consegue criar conta, confirmar o e-mail e o convite fica consumido.
- AC-02: Um convite expirado, revogado ou utilizado não pode criar ou ativar outra conta.
- AC-03: Usuário sem sessão não acessa páginas privadas nem APIs privadas.
- AC-04: Um membro não consegue executar ações administrativas alterando URLs ou chamadas HTTP.
- AC-05: Segredos privilegiados não aparecem no bundle do cliente, logs públicos ou repositório.
- AC-41: Usuário ativo sem nome de exibição é direcionado a defini-lo antes de acessar o restante da plataforma (D28).
- AC-42: Apenas a gerência altera papéis; ninguém altera o próprio papel (D29).
- AC-43: Não é possível rebaixar ou desativar o último gerente ativo (D29).
- AC-44: Conta desativada não acessa páginas nem dados, mesmo com sessão ainda válida; reativada, volta a acessar com os dados preservados (D9).
- AC-45: Mudanças de papel e de status de conta registram autor e data.
- AC-46: O usuário recupera a senha por e-mail sem que a resposta revele se o e-mail tem conta (D8).

## Trilhas e conteúdo
- AC-06: Um membro vê apenas trilhas publicadas.
- AC-07: Um responsável técnico ou gerente consegue criar, editar, salvar como rascunho e publicar uma trilha; um membro não consegue (D23).
- AC-08: Uma trilha pode conter módulos e cada módulo pode conter atividades ordenadas.
- AC-09: Uma atividade exibe instruções, tipo, critérios, links externos e competências associadas.
- AC-10: Alterar uma atividade não apaga o histórico de progresso e submissões já existentes (D26).
- AC-47: Uma trilha com pré-requisito não concluído aparece bloqueada, com o motivo, e o servidor rejeita iniciar suas atividades (D27).
- AC-48: O modo de conclusão segue o tipo: conteúdo é autodeclarado; exercício, projeto e avaliação exigem revisão (D24).

## Progresso e submissões
- AC-11: Cada usuário mantém progresso independente por atividade.
- AC-12: Atividade de conteúdo pode ser concluída por autodeclaração, sem revisão manual.
- AC-13: Atividade que exige revisão não é concluída por autodeclaração.
- AC-14: O membro pode enviar evidência (URL `http`/`https` e/ou texto) e consultar seu estado e feedback (D25).
- AC-15: Reenvios criam nova versão, mantêm o histórico e não duplicam o registro de progresso (D4).
- AC-16: O usuário A não consegue consultar ou alterar submissões privadas do usuário B.

## Fila de revisão
- AC-17: Submissão pendente aparece na fila compartilhada de revisores elegíveis.
- AC-18: Dois revisores tentando assumir a mesma submissão simultaneamente resultam em apenas uma atribuição válida.
- AC-19: Revisor pode aprovar ou solicitar ajustes, registrando feedback.
- AC-20: O autor não pode revisar a própria entrega.
- AC-21: Revisão guarda revisor, data, decisão e feedback.
- AC-22: Ações não autorizadas ou transições inválidas são rejeitadas pelo servidor.
- AC-49: O revisor libera a submissão que assumiu; a gerência libera ou reatribui qualquer submissão assumida; ambos os eventos ficam registrados (D19).

## Competências
- AC-23: Competência pode estar em um dos três estados definidos.
- AC-24: Iniciar atividade associada marca a competência como "em desenvolvimento" (D10).
- AC-25: Competência só passa para "demonstrada" após uma submissão aprovada de atividade associada; conclusão autodeclarada não basta (D11).
- AC-26: A origem da evidência que fundamentou uma competência demonstrada pode ser consultada por usuários autorizados.
- AC-27: Alterar uma atividade não apaga evidências de competências anteriores.
- AC-50: Correção de estado de competência exige motivo, registra autor e não pode ser feita sobre o próprio usuário (D12).

## XP, níveis e ranking
- AC-28: Recompensa elegível é registrada no histórico de XP.
- AC-29: Repetir a mesma requisição não duplica a recompensa.
- AC-30: O cliente não pode determinar livremente valor, usuário destinatário ou evento de XP.
- AC-31: Correção de pontuação gera transação corretiva com motivo e autor autorizado, que não pode ser o próprio destinatário (D16).
- AC-32: Nível é calculado conforme limites documentados.
- AC-33: Ranking é ordenado por XP, empates compartilham a posição e só exibe nome de exibição, nível e XP (D20).
- AC-34: Recompensa de aprovação ocorre somente após a aprovação persistida com sucesso.
- AC-51: Atividade não elegível (`xp_reward = 0`) não gera transação de XP (D15).

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
- Usuário tenta alterar o próprio papel; gerente tenta rebaixar o último gerente.
- Responsável técnico tenta corrigir o próprio XP ou competência.
- Membro tenta iniciar atividade de trilha bloqueada.
- Conta desativada tenta acessar com sessão ainda válida.
- Duas requisições concorrentes tentam assumir a mesma revisão.
- Uma requisição de recompensa é repetida.
- Um convite expirado ou já usado é reapresentado.
