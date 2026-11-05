-- Fase 2b: gestao de contas.
-- Nome de exibicao (D28), alteracao de papel e desativacao pela gerencia
-- (D9, D21, D29) e historico imutavel de eventos de conta.

create table public.account_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  event_type text not null,
  old_value text,
  new_value text,
  actor_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  constraint account_events_type check (
    event_type in ('role_changed', 'disabled', 'reactivated')
  )
);

comment on table public.account_events is
  'Historico imutavel de mudancas de papel e status de conta.';

create index account_events_user_idx
  on public.account_events (user_id, created_at desc);

alter table public.account_events enable row level security;

revoke all on table public.account_events from anon;
revoke all on table public.account_events from authenticated;
grant select on table public.account_events to authenticated;

-- Somente leitura pela gerencia. Escrita apenas pelas funcoes abaixo.
create policy account_events_select_manager
on public.account_events
for select
to authenticated
using (public.has_role_at_least('manager'));

-- Nome de exibicao do proprio usuario ativo. Nao recebe user_id do cliente.
create or replace function public.set_display_name(p_display_name text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name text := btrim(coalesce(p_display_name, ''));
begin
  if auth.uid() is null or not public.is_user_active(auth.uid()) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  if char_length(v_name) < 2 or char_length(v_name) > 60 then
    raise exception 'invalid_display_name' using errcode = '22023';
  end if;

  update public.profiles
  set display_name = v_name
  where id = auth.uid();

  return v_name;
end;
$$;

-- Estado da propria conta, inclusive quando inativa ou desativada
-- (o RLS de profiles oculta o perfil nesses casos).
create or replace function public.get_my_account_status()
returns table (activated boolean, disabled boolean)
language sql
stable
security definer
set search_path = ''
as $$
  select p.activated_at is not null, p.disabled_at is not null
  from public.profiles p
  where p.id = auth.uid();
$$;

-- Serializa operacoes que podem remover gerentes e revalida o chamador
-- apos obter o bloqueio. Sem isso, dois gerentes rebaixando um ao outro
-- ao mesmo tempo poderiam deixar o sistema sem gerente ativo.
create or replace function public.lock_managers_and_authorize()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform 1
  from public.profiles
  where role = 'manager'
  order by id
  for update;

  if not public.has_role_at_least('manager') then
    raise exception 'not_authorized' using errcode = '42501';
  end if;
end;
$$;

create or replace function public.other_active_managers(p_user_id uuid)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::integer
  from public.profiles
  where role = 'manager'
    and activated_at is not null
    and disabled_at is null
    and id <> p_user_id;
$$;

create or replace function public.change_user_role(
  p_user_id uuid,
  p_role public.user_role
)
returns public.user_role
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
  if p_user_id is null or p_role is null then
    raise exception 'invalid_input' using errcode = '22023';
  end if;
  if p_user_id = auth.uid() then
    raise exception 'cannot_change_own_role' using errcode = 'P0001';
  end if;

  perform public.lock_managers_and_authorize();

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
  if v_target.role = p_role then
    return p_role;
  end if;

  if v_target.role = 'manager'
    and public.other_active_managers(p_user_id) < 1 then
    raise exception 'last_manager' using errcode = 'P0001';
  end if;

  update public.profiles
  set role = p_role
  where id = p_user_id;

  insert into public.account_events (user_id, event_type, old_value, new_value, actor_id)
  values (p_user_id, 'role_changed', v_target.role::text, p_role::text, auth.uid());

  return p_role;
end;
$$;

create or replace function public.set_user_disabled(
  p_user_id uuid,
  p_disabled boolean
)
returns boolean
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
  if p_user_id is null or p_disabled is null then
    raise exception 'invalid_input' using errcode = '22023';
  end if;
  if p_user_id = auth.uid() then
    raise exception 'cannot_change_own_status' using errcode = 'P0001';
  end if;

  perform public.lock_managers_and_authorize();

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
  if (v_target.disabled_at is not null) = p_disabled then
    return p_disabled;
  end if;

  if p_disabled
    and v_target.role = 'manager'
    and public.other_active_managers(p_user_id) < 1 then
    raise exception 'last_manager' using errcode = 'P0001';
  end if;

  update public.profiles
  set disabled_at = case when p_disabled then now() else null end
  where id = p_user_id;

  insert into public.account_events (user_id, event_type, actor_id)
  values (
    p_user_id,
    case when p_disabled then 'disabled' else 'reactivated' end,
    auth.uid()
  );

  return p_disabled;
end;
$$;

revoke all on function public.set_display_name(text) from public;
revoke all on function public.get_my_account_status() from public;
revoke all on function public.lock_managers_and_authorize() from public;
revoke all on function public.other_active_managers(uuid) from public;
revoke all on function public.change_user_role(uuid, public.user_role) from public;
revoke all on function public.set_user_disabled(uuid, boolean) from public;

grant execute on function public.set_display_name(text) to authenticated;
grant execute on function public.get_my_account_status() to authenticated;
grant execute on function public.change_user_role(uuid, public.user_role) to authenticated;
grant execute on function public.set_user_disabled(uuid, boolean) to authenticated;
-- lock_managers_and_authorize e other_active_managers sao internas.
