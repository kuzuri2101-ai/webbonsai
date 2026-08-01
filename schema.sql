-- CÂY SAO RỒI? - database cho tài khoản + cây chia sẻ cộng đồng
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Người yêu cây',
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.plants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  species text,
  description text,
  image_url text,
  care_notes text,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.plants enable row level security;

drop policy if exists "Public can view profiles" on public.profiles;
create policy "Public can view profiles" on public.profiles
for select using (true);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles
for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Anyone can view public plants" on public.plants;
create policy "Anyone can view public plants" on public.plants
for select using (is_public = true or auth.uid() = user_id);

drop policy if exists "Users can create own plants" on public.plants;
create policy "Users can create own plants" on public.plants
for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own plants" on public.plants;
create policy "Users can update own plants" on public.plants
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can delete own plants" on public.plants;
create policy "Users can delete own plants" on public.plants
for delete using (auth.uid() = user_id);

-- Tự tạo hồ sơ ngay khi đăng ký tài khoản.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(coalesce(new.email, 'Nguoi yeu cay'), '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create index if not exists plants_public_created_idx on public.plants (is_public, created_at desc);
create index if not exists plants_user_idx on public.plants (user_id, created_at desc);
