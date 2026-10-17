-- Leitura de informacoes do convite para a pagina de aceite.
-- Exposta a anon e authenticated porque o token de convite e o proprio segredo
-- de acesso: somente quem possui o link consegue consultar.
create or replace function public.get_invitation_info(p_token_hash text)
returns table (
  email_normalized text,
  role public.user_role,
  is_expired boolean,
  is_revoked boolean,
  is_used boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    i.email_normalized,
    i.role,
    i.expires_at <= now(),
    i.revoked_at is not null,
    i.used_at is not null
  from public.invitations i
  where i.token_hash = p_token_hash;
$$;

revoke all on function public.get_invitation_info(text) from public;
grant execute on function public.get_invitation_info(text) to anon;
grant execute on function public.get_invitation_info(text) to authenticated;
