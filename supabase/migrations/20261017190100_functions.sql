-- Funcoes de autorizacao e operacoes transacionais.

create or replace function public.role_rank(p_role public.user_role)
returns integer
language sql
immutable
set search_path = ''
as $$
  select case p_role
    when 'manager' then 3
    when 'reviewer' then 2
    when 'member' then 1
  end;
$$;

create or replace function public.current_profile_role()
returns public.user_role
language sql
stable
security definer
set search_path = ''
as $$
  select p.role
  from public.profiles p
  where p.id = auth.uid()
    and p.activated_at is not null
    and p.disabled_at is null;
$$;

create or replace function public.has_role_at_least(p_required public.user_role)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    public.role_rank(public.current_profile_role())
      >= public.role_rank(p_required),
    false
  );
$$;

create or replace function public.is_user_active(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = p_user_id
      and p.activated_at is not null
      and p.disabled_at is null
  );
$$;

-- Consome o convite de forma atomica. O token bruto nunca chega ao banco:
-- o servidor envia apenas o hash SHA-256.
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
      activated_at = coalesce(activated_at, now())
  where id = p_user_id;

  return query
  select v_invitation.role, true;
end;
$$;

-- Revoga um convite ainda nao utilizado. Apenas gerencia.
create or replace function public.revoke_invitation(p_invitation_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_changed integer;
begin
  if not public.has_role_at_least('manager') then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  update public.invitations
  set revoked_at = now()
  where id = p_invitation_id
    and used_at is null
    and revoked_at is null;

  get diagnostics v_changed = row_count;
  return v_changed > 0;
end;
$$;

revoke all on function public.role_rank(public.user_role) from public;
revoke all on function public.current_profile_role() from public;
revoke all on function public.has_role_at_least(public.user_role) from public;
revoke all on function public.is_user_active(uuid) from public;
revoke all on function public.consume_invitation(text, uuid) from public;
revoke all on function public.revoke_invitation(uuid) from public;

grant execute on function public.role_rank(public.user_role) to authenticated;
grant execute on function public.current_profile_role() to authenticated;
grant execute on function public.has_role_at_least(public.user_role) to authenticated;
grant execute on function public.is_user_active(uuid) to authenticated;
grant execute on function public.consume_invitation(text, uuid) to authenticated;
grant execute on function public.revoke_invitation(uuid) to authenticated;
