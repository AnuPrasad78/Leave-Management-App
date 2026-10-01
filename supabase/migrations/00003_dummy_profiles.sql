-- 00003_dummy_profiles.sql
-- Creates 5 test users (password for all: Password@123) and fills their profiles.
-- U5 (Prastina Mary) is manager of U1; U1 is manager of U2/U3/U4.
-- Run after 00001 and 00002. Re-runnable (email/id conflict-safe).

-- 1) auth users (inserting into auth.users fires the signup trigger, and also
--    creates an empty profiles row, which the profiles insert below fills).
--    WHERE NOT EXISTS instead of ON CONFLICT: auth.users has no plain unique
--    constraint on email, only a composite/partial index.
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  raw_app_meta_data, raw_user_meta_data, email_confirmed_at, created_at, updated_at
)
select '00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111101', 'authenticated', 'authenticated',
       'vootkuri.reddy@emids.com', crypt('Password@123', gen_salt('bf')),
       jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')), '{}', now(), now(), now()
where not exists (select 1 from auth.users where id = '11111111-1111-1111-1111-111111111101');

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  raw_app_meta_data, raw_user_meta_data, email_confirmed_at, created_at, updated_at
)
select '00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111102', 'authenticated', 'authenticated',
       'ananya.sharma@emids.com', crypt('Password@123', gen_salt('bf')),
       jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')), '{}', now(), now(), now()
where not exists (select 1 from auth.users where id = '11111111-1111-1111-1111-111111111102');

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  raw_app_meta_data, raw_user_meta_data, email_confirmed_at, created_at, updated_at
)
select '00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111103', 'authenticated', 'authenticated',
       'rahul.menon@emids.com', crypt('Password@123', gen_salt('bf')),
       jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')), '{}', now(), now(), now()
where not exists (select 1 from auth.users where id = '11111111-1111-1111-1111-111111111103');

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  raw_app_meta_data, raw_user_meta_data, email_confirmed_at, created_at, updated_at
)
select '00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111104', 'authenticated', 'authenticated',
       'priya.nair@emids.com', crypt('Password@123', gen_salt('bf')),
       jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')), '{}', now(), now(), now()
where not exists (select 1 from auth.users where id = '11111111-1111-1111-1111-111111111104');

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  raw_app_meta_data, raw_user_meta_data, email_confirmed_at, created_at, updated_at
)
select '00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111105', 'authenticated', 'authenticated',
       'prastina.mary@emids.com', crypt('Password@123', gen_salt('bf')),
       jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')), '{}', now(), now(), now()
where not exists (select 1 from auth.users where id = '11111111-1111-1111-1111-111111111105');

-- 1b) auth.identities: GoTrue resolves email logins through this table
--     (the dashboard "Add user" creates it; direct SQL inserts must too).
insert into auth.identities (user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
select '11111111-1111-1111-1111-111111111101', 'vootkuri.reddy@emids.com', 'email',
       jsonb_build_object('sub', '11111111-1111-1111-1111-111111111101', 'email', 'vootkuri.reddy@emids.com', 'email_verified', true),
       now(), now(), now()
where not exists (
  select 1 from auth.identities where provider = 'email' and provider_id = 'vootkuri.reddy@emids.com'
);

insert into auth.identities (user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
select '11111111-1111-1111-1111-111111111102', 'ananya.sharma@emids.com', 'email',
       jsonb_build_object('sub', '11111111-1111-1111-1111-111111111102', 'email', 'ananya.sharma@emids.com', 'email_verified', true),
       now(), now(), now()
where not exists (
  select 1 from auth.identities where provider = 'email' and provider_id = 'ananya.sharma@emids.com'
);

insert into auth.identities (user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
select '11111111-1111-1111-1111-111111111103', 'rahul.menon@emids.com', 'email',
       jsonb_build_object('sub', '11111111-1111-1111-1111-111111111103', 'email', 'rahul.menon@emids.com', 'email_verified', true),
       now(), now(), now()
where not exists (
  select 1 from auth.identities where provider = 'email' and provider_id = 'rahul.menon@emids.com'
);

insert into auth.identities (user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
select '11111111-1111-1111-1111-111111111104', 'priya.nair@emids.com', 'email',
       jsonb_build_object('sub', '11111111-1111-1111-1111-111111111104', 'email', 'priya.nair@emids.com', 'email_verified', true),
       now(), now(), now()
where not exists (
  select 1 from auth.identities where provider = 'email' and provider_id = 'priya.nair@emids.com'
);

insert into auth.identities (user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
select '11111111-1111-1111-1111-111111111105', 'prastina.mary@emids.com', 'email',
       jsonb_build_object('sub', '11111111-1111-1111-1111-111111111105', 'email', 'prastina.mary@emids.com', 'email_verified', true),
       now(), now(), now()
where not exists (
  select 1 from auth.identities where provider = 'email' and provider_id = 'prastina.mary@emids.com'
);

-- 2) profile details (fills the rows the trigger created)
insert into public.profiles (id, emp_id, name, initials, role, email, account, project, function, manager_id) values
  ('11111111-1111-1111-1111-111111111101', 'INEMP7819', 'Vootkuri Sai Nithin Reddy', 'VS', 'ASSOCIATE CONSULTANT', 'vootkuri.reddy@emids.com', 'Investments & Strategic', 'AI Industrial', 'Delivery', '11111111-1111-1111-1111-111111111105'),
  ('11111111-1111-1111-1111-111111111102', 'INEMP6421', 'Ananya Sharma',             'AS', 'CONSULTANT',           'ananya.sharma@emids.com', 'Investments & Strategic', 'AI Industrial', 'Delivery', '11111111-1111-1111-1111-111111111101'),
  ('11111111-1111-1111-1111-111111111103', 'INEMP5589', 'Rahul Menon',               'RM', 'SENIOR CONSULTANT',     'rahul.menon@emids.com',     'Investments & Strategic', 'AI Industrial', 'Delivery', '11111111-1111-1111-1111-111111111101'),
  ('11111111-1111-1111-1111-111111111104', 'INEMP7012', 'Priya Nair',                'PN', 'ANALYST',               'priya.nair@emids.com',       'Investments & Strategic', 'AI Industrial', 'Delivery', '11111111-1111-1111-1111-111111111101'),
  ('11111111-1111-1111-1111-111111111105', 'INEMP7000', 'Prastina Mary',             'PM', 'ASSOCIATE MANAGER',    'prastina.mary@emids.com',     'Investments & Strategic', 'AI Industrial', 'Delivery', null)
on conflict (id) do update
  set emp_id = excluded.emp_id,
      name = excluded.name,
      initials = excluded.initials,
      role = excluded.role,
      account = excluded.account,
      project = excluded.project,
      function = excluded.function,
      manager_id = excluded.manager_id;

-- 3) sample leave_balances so the dashboard/balances display real numbers
insert into public.leave_balances (employee_id, year, opening, credited) values
  ('11111111-1111-1111-1111-111111111101', 2026, 0, 25),
  ('11111111-1111-1111-1111-111111111102', 2026, 0, 25),
  ('11111111-1111-1111-1111-111111111103', 2026, 0, 25),
  ('11111111-1111-1111-1111-111111111104', 2026, 0, 25),
  ('11111111-1111-1111-1111-111111111105', 2026, 0, 25)
on conflict (employee_id, year) do nothing;
