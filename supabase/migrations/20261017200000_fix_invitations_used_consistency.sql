-- Corrige a consistencia de uso do convite.
-- O vinculo anterior exigia que used_at e used_by fossem ambos nulos ou ambos
-- preenchidos. Porem, ao deletar um usuario, used_by vira NULL (ON DELETE SET
-- NULL) enquanto used_at permanece, o que quebrava a exclusao do usuario.
-- A regra correta: se ha um usuario consumidor, deve haver used_at.

alter table public.invitations
  drop constraint invitations_used_consistency;

alter table public.invitations
  add constraint invitations_used_consistency
  check (used_by is null or used_at is not null);
