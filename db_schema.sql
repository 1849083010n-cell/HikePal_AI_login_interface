-- ==============================================================================
-- 1. Create Tables (建立表格)
-- ==============================================================================

-- Create a table for public profiles
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  username text unique,
  full_name text,
  avatar_url text,
  role text default 'hiker',
  constraint username_length check (char_length(username) >= 3)
);

-- ==============================================================================
-- 2. Row Level Security (RLS 安全设置)
-- ==============================================================================

-- Enable RLS
alter table public.profiles enable row level security;

-- SAFELY CREATE POLICIES (先删除旧的，再创建新的，防止报错)

-- Policy: Everyone can view profiles (允许所有人看)
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

-- Policy: Users can insert their own profile (允许用户创建自己的资料)
drop policy if exists "Users can insert their own profile." on public.profiles;
create policy "Users can insert their own profile." on public.profiles
  for insert with check ((select auth.uid()) = id);

-- Policy: Users can update their own profile (允许用户修改自己的资料)
drop policy if exists "Users can update own profile." on public.profiles;
create policy "Users can update own profile." on public.profiles
  for update using ((select auth.uid()) = id);

-- ==============================================================================
-- 3. Automation (自动化魔法 - Triggers)
-- ==============================================================================

-- Function: Define what happens when a new user signs up
-- 这个函数负责把 auth 表里的数据搬运到 profiles 表
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, username)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'username'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger: Hook the function to the auth.users table
-- 只要 auth.users 有新数据，就执行上面的函数
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();