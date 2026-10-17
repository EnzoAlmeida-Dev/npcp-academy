-- Etapa 1: papeis, perfis e convites.
-- Nao armazena senhas nem segredos de autenticacao (ficam em auth.users).

create type public.user_role as enum ('member', 'reviewer', 'manager');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  role public.user_role not null default 'member',
  activated_at timestamptz,
  disabled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'Perfil da aplicacao vinculado a auth.users. Nao armazena senhas.';

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  email_normalized text not null,
  token_hash text not null unique,
  role public.user_role not null default 'member',
  expires_at timestamptz not null,
  used_at timestamptz,
  used_by uuid references public.profiles (id) on delete set null,
  revoked_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  constraint invitations_email_normalized check (
    email_normalized = lower(btrim(email_normalized))
    and length(email_normalized) > 3
  ),
  constraint invitations_expiry_after_creation check (expires_at > created_at),
  constraint invitations_used_consistency check (
    (used_at is null) = (used_by is null)
  )
);

comment on table public.invitations is
  'Convites de uso unico. Armazena apenas o hash do token.';

create index invitations_active_email_idx
  on public.invitations (email_normalized)
  where used_at is null and revoked_at is null;

create index invitations_created_by_idx on public.invitations (created_by);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Cria o perfil inativo no cadastro. A ativacao ocorre somente em consume_invitation.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    nullif(btrim(coalesce(new.raw_user_meta_data ->> 'display_name', '')), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
