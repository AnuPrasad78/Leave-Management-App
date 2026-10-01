-- 00001_initial_schema.sql
-- Schema for the Leave Management App.
-- Runs in the Supabase SQL editor, or via `supabase db push`.

create extension if not exists pgcrypto;

-- --------------------------------------------------------------------------
-- profiles: one row per auth user (id == auth.users.id)
-- --------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  emp_id      text unique,
  name        text,
  initials    text,
  role        text,
  email       text,
  account     text,
  project     text,
  function    text,
  manager_id  uuid references public.profiles (id),
  created_at  timestamptz not null default now()
);

-- --------------------------------------------------------------------------
-- leave_types: reference table for the fixed set of leave categories
-- --------------------------------------------------------------------------
create table if not exists public.leave_types (
  id        smallint primary key,
  code      text not null unique,
  name      text not null,
  format    text not null default 'Days',
  is_paid   boolean not null default true,
  active    boolean not null default true
);

-- --------------------------------------------------------------------------
-- leave_balances: yearly balance backing the dashboard
-- --------------------------------------------------------------------------
create table if not exists public.leave_balances (
  id             uuid primary key default gen_random_uuid(),
  employee_id    uuid not null references public.profiles (id) on delete cascade,
  year           int not null,
  opening        int not null default 0,
  credited       int not null default 0,
  cont_utilized   int not null default 0,
  cont_available  int not null default 0,
  unique (employee_id, year)
);

-- --------------------------------------------------------------------------
-- leave_requests
-- --------------------------------------------------------------------------
create table if not exists public.leave_requests (
  id            uuid primary key default gen_random_uuid(),
  employee_id   uuid not null references public.profiles (id) on delete cascade,
  leave_type_id smallint not null references public.leave_types (id),
  start_date     date not null,
  end_date       date not null,
  duration      text not null default 'Full Day'
                check (duration in ('Full Day', 'Half Day')),
  days          numeric not null default 1,
  reason        text,
  status        text not null default 'Pending'
                check (status in ('Pending', 'Approved', 'Rejected', 'Cancelled')),
  requested_on  date not null default current_date,
  reviewed_by   uuid references public.profiles (id),
  reviewed_at   timestamptz,
  created_at    timestamptz not null default now()
);

create index if not exists leave_requests_employee_idx  on public.leave_requests (employee_id);
create index if not exists leave_requests_status_idx    on public.leave_requests (status);
create index if not exists leave_requests_type_idx      on public.leave_requests (leave_type_id);
create index if not exists leave_requests_reviewed_idx  on public.leave_requests (reviewed_by);

-- --------------------------------------------------------------------------
-- holidays
-- --------------------------------------------------------------------------
create table if not exists public.holidays (
  id           int primary key,
  country      text not null,
  year         int not null,
  location     text not null,
  date         date not null,
  day          text not null,
  description  text not null,
  is_optional  boolean not null default false,
  unique (location, year, date)
);

-- --------------------------------------------------------------------------
-- separation_requests
-- --------------------------------------------------------------------------
create table if not exists public.separation_requests (
  id                uuid primary key default gen_random_uuid(),
  employee_id       uuid not null references public.profiles (id) on delete cascade,
  last_working_day  date not null,
  reason            text,
  remarks           text,
  status            text not null default 'Pending'
                    check (status in ('Pending', 'Approved', 'Rejected', 'Cancelled')),
  requested_on      date not null default current_date,
  created_at        timestamptz not null default now()
);

create index if not exists separation_requests_employee_idx on public.separation_requests (employee_id);
create index if not exists separation_requests_status_idx   on public.separation_requests (status);

-- --------------------------------------------------------------------------
-- is_manager_of(profile_id): true when the current user is the manager of the
-- given profile (the reporting line that backs "approve team requests").
-- security definer so managers can read/update their reports' rows via RLS.
-- --------------------------------------------------------------------------
create or replace function public.is_manager_of(target_profile uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = target_profile
      and p.manager_id = auth.uid()
  );
$$;

-- --------------------------------------------------------------------------
-- Signup trigger: create a profiles row whenever a new auth user is created.
-- --------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- --------------------------------------------------------------------------
-- Row Level Security
-- --------------------------------------------------------------------------
alter table public.profiles          enable row level security;
alter table public.leave_types       enable row level security;
alter table public.leave_balances    enable row level security;
alter table public.leave_requests    enable row level security;
alter table public.holidays          enable row level security;
alter table public.separation_requests enable row level security;

-- profiles
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id or public.is_manager_of(id));

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- leave_types (read-only for authenticated users)
drop policy if exists "leave_types_select_authenticated" on public.leave_types;
create policy "leave_types_select_authenticated" on public.leave_types
  for select to authenticated using (true);

-- leave_balances
drop policy if exists "leave_balances_select_own" on public.leave_balances;
create policy "leave_balances_select_own" on public.leave_balances
  for select using (auth.uid() = employee_id or public.is_manager_of(employee_id));

-- leave_requests
drop policy if exists "leave_requests_select" on public.leave_requests;
create policy "leave_requests_select" on public.leave_requests
  for select using (auth.uid() = employee_id or public.is_manager_of(employee_id));

drop policy if exists "leave_requests_insert_own" on public.leave_requests;
create policy "leave_requests_insert_own" on public.leave_requests
  for insert with check (auth.uid() = employee_id);

drop policy if exists "leave_requests_update_own_pending" on public.leave_requests;
create policy "leave_requests_update_own_pending" on public.leave_requests
  for update using (auth.uid() = employee_id and status = 'Pending');

drop policy if exists "leave_requests_update_team" on public.leave_requests;
create policy "leave_requests_update_team" on public.leave_requests
  for update using (public.is_manager_of(employee_id));

drop policy if exists "leave_requests_delete_own" on public.leave_requests;
create policy "leave_requests_delete_own" on public.leave_requests
  for delete using (auth.uid() = employee_id and status = 'Pending');

-- holidays (read-only for authenticated users)
drop policy if exists "holidays_select_authenticated" on public.holidays;
create policy "holidays_select_authenticated" on public.holidays
  for select to authenticated using (true);

-- separation_requests
drop policy if exists "separation_requests_select" on public.separation_requests;
create policy "separation_requests_select" on public.separation_requests
  for select using (auth.uid() = employee_id or public.is_manager_of(employee_id));

drop policy if exists "separation_requests_insert_own" on public.separation_requests;
create policy "separation_requests_insert_own" on public.separation_requests
  for insert with check (auth.uid() = employee_id);

drop policy if exists "separation_requests_update_own_pending" on public.separation_requests;
create policy "separation_requests_update_own_pending" on public.separation_requests
  for update using (auth.uid() = employee_id and status = 'Pending');
