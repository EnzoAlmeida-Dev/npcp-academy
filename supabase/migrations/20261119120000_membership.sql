-- Fase 3a: vinculo trainee/efetivado (D44).
-- Independente do papel: o papel trata de permissoes; o vinculo, do acesso as trilhas.

create type public.membership as enum ('trainee', 'efetivado');

alter table public.profiles
  add column membership public.membership not null default 'trainee';

alter table public.invitations
  add column membership public.membership not null default 'trainee';

-- Contas e convites existentes antes do vinculo passam a efetivado (decisao do
-- responsavel do produto); a gerencia ajusta depois, se preciso.
update public.profiles set membership = 'efetivado';
update public.invitations set membership = 'efetivado';

-- Historico de contas passa a registrar mudanca de vinculo.
alter table public.account_events
  drop constraint account_events_type;

alter table public.account_events
  add constraint account_events_type check (
    event_type in ('role_changed', 'disabled', 'reactivated', 'membership_changed')
  );

-- Consumo do convite tambem aplica o vinculo definido pela gerencia.
-- Mesma logica de 20261017190100_functions.sql, acrescida de membership.
create or replace function public.consume_invitation(
  p_token_hash text,
  p_user_id uuid
)
returns table (role public.user_role, activated boolean)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_invitation public.invitations%rowtype;
  v_invitation_id uuid;
  v_email text;
  v_email_confirmed timestamptz;
begin
  if p_user_id is null or p_user_id is distinct from auth.uid() then
    raise exception 'invalid_invitation' using errcode = 'P0001';
  end if;

  select * into v_invitation
  from public.invitations
  where token_hash = p_token_hash;

  if not found then
    raise exception 'invalid_invitation' using errcode = 'P0001';
  end if;

  -- Idempotencia apenas para o mesmo usuario que ja consumiu o token.
  if v_invitation.used_by is not null then
    if v_invitation.used_by = p_user_id then
      update public.profiles
      set role = v_invitation.role,
          membership = v_invitation.membership,
          activated_at = coalesce(activated_at, now())
      where id = p_user_id;

      return query
      select v_invitation.role, true;
      return;
    end if;

    raise exception 'invalid_invitation' using errcode = 'P0001';
  end if;

  if v_invitation.revoked_at is not null
    or v_invitation.expires_at <= now() then
    raise exception 'invalid_invitation' using errcode = 'P0001';
  end if;

  v_invitation_id := v_invitation.id;

  -- Bloqueio de linha: garante uma unica operacao bem-sucedida em concorrencia.
  select * into v_invitation
  from public.invitations
  where id = v_invitation_id
    and used_at is null
    and revoked_at is null
    and expires_at > now()
  for update;

  if not found then
    raise exception 'invalid_invitation' using errcode = 'P0001';
  end if;

  select lower(btrim(u.email)), u.email_confirmed_at
  into v_email, v_email_confirmed
  from auth.users u
  where u.id = p_user_id;

  if v_email is null
    or v_email <> v_invitation.email_normalized
    or v_email_confirmed is null then
    raise exception 'invalid_invitation' using errcode = 'P0001';
  end if;

  update public.invitations
  set used_at = now(), used_by = p_user_id
  where id = v_invitation_id;

  update public.profiles
  set role = v_invitation.role,
      membership = v_invitation.membership,
      activated_at = coalesce(activated_at, now())
  where id = p_user_id;

  return query
  select v_invitation.role, true;
end;
$$;

-- A lista de usuarios passa a trazer o vinculo (muda o tipo de retorno).
drop function public.list_users_for_admin();

create function public.list_users_for_admin()
returns table (
  id uuid,
  email text,
  display_name text,
  role public.user_role,
  membership public.membership,
  activated_at timestamptz,
  disabled_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.has_role_at_least('manager') then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  return query
  select
    p.id,
    u.email::text,
    p.display_name,
    p.role,
    p.membership,
    p.activated_at,
    p.disabled_at
  from public.profiles p
  join auth.users u on u.id = p.id
  order by p.created_at;
end;
$$;

revoke all on function public.list_users_for_admin() from public;
grant execute on function public.list_users_for_admin() to authenticated;

-- Alteracao de vinculo pela gerencia (efetivacao). Ninguem altera o proprio.
create or replace function public.set_user_membership(
  p_user_id uuid,
  p_membership public.membership
)
returns public.membership
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_target public.profiles%rowtype;
begin
  if not public.has_role_at_least('manager') then
    raise exception 'not_authorized' using errcode = '42501';
  end if;
  if p_user_id is null or p_membership is null then
    raise exception 'invalid_input' using errcode = '22023';
  end if;
  if p_user_id = auth.uid() then
    raise exception 'cannot_change_own_membership' using errcode = 'P0001';
  end if;

  select * into v_target
  from public.profiles
  where id = p_user_id
  for update;

  if not found then
    raise exception 'user_not_found' using errcode = 'P0002';
  end if;
  if v_target.activated_at is null then
    raise exception 'user_not_activated' using errcode = 'P0001';
  end if;
  if v_target.membership = p_membership then
    return p_membership;
  end if;

  update public.profiles
  set membership = p_membership
  where id = p_user_id;

  insert into public.account_events (user_id, event_type, old_value, new_value, actor_id)
  values (
    p_user_id,
    'membership_changed',
    v_target.membership::text,
    p_membership::text,
    auth.uid()
  );

  return p_membership;
end;
$$;

revoke all on function public.set_user_membership(uuid, public.membership) from public;
grant execute on function public.set_user_membership(uuid, public.membership) to authenticated;
