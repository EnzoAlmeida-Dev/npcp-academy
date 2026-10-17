-- RLS: autorizacao no banco, com hierarquia explicita
-- manager > reviewer > member. Usuarios inativos ou desativados nao acessam.

alter table public.profiles enable row level security;
alter table public.invitations enable row level security;

revoke all on table public.profiles from anon;
revoke all on table public.invitations from anon;
revoke all on table public.profiles from authenticated;
revoke all on table public.invitations from authenticated;

grant select on table public.profiles to authenticated;
grant select, insert on table public.invitations to authenticated;

-- Perfil: ve o proprio perfil ativo, ou a gerencia ve todos.
create policy profiles_select_self_or_manager
on public.profiles
for select
to authenticated
using (
  (id = auth.uid() and public.is_user_active(auth.uid()))
  or public.has_role_at_least('manager')
);

-- Convites: apenas gerencia lista e cria. Criacao registra o autor real.
create policy invitations_select_manager
on public.invitations
for select
to authenticated
using (public.has_role_at_least('manager'));

create policy invitations_insert_manager
on public.invitations
for insert
to authenticated
with check (
  public.has_role_at_least('manager')
  and created_by = auth.uid()
);
