create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  role text default 'user',
  created_at timestamptz default now()
);

create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();


-- 1. Función que sincroniza el rol hacia auth.users
create or replace function public.sync_user_role()
returns trigger as $$
begin
  update auth.users
  set raw_app_meta_data = raw_app_meta_data || jsonb_build_object('role', new.role)
  where id = new.id;
  return new;
end;
$$ language plpgsql security definer;
-- 2. Trigger que se dispara cuando actualizas la tabla public.users
create trigger on_role_change
after update of role on public.users
for each row
when (old.role is distinct from new.role)
execute procedure public.sync_user_role();
