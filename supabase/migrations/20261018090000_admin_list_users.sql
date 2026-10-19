-- Lista de usuarios para administracao (somente leitura).
-- Retorna dados de perfil + e-mail (de auth.users) apenas para gerencia.

create or replace function public.list_users_for_admin()
returns table (
  id uuid,
  email text,
  display_name text,
  role public.user_role,
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
    p.activated_at,
    p.disabled_at
  from public.profiles p
  join auth.users u on u.id = p.id
  order by p.created_at;
end;
$$;

revoke all on function public.list_users_for_admin() from public;
grant execute on function public.list_users_for_admin() to authenticated;
