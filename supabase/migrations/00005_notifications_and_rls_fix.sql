-- 00005_notifications_and_rls_fix.sql
-- 1) Close the RLS gap where an employee could set their own request's status
--    via a direct Supabase call (update policies are OR'd together, so the
--    own-pending policy needs a WITH CHECK that keeps status = 'Pending').
-- 2) Add a notifications table + trigger-based notifications so managers see
--    approval requests and employees see decisions.
-- Runs after 00001..00004. Re-runnable.

-- --------------------------------------------------------------------------
-- RLS fix: employees keep edit/delete on their OWN pending requests, but no
-- client-side update may move a row out of 'Pending' or forge review data.
-- --------------------------------------------------------------------------
drop policy if exists "leave_requests_update_own_pending" on public.leave_requests;
create policy "leave_requests_update_own_pending" on public.leave_requests
  for update to authenticated
  using (auth.uid() = employee_id and status = 'Pending')
  with check (
    auth.uid() = employee_id
    and status = 'Pending'
    and reviewed_by is null
    and reviewed_at is null
  );

-- Same tightening for the manager path: the new employee_id must still be a
-- direct report, and status moves stay manager actions via is_manager_of().
drop policy if exists "leave_requests_update_team" on public.leave_requests;
create policy "leave_requests_update_team" on public.leave_requests
  for update to authenticated
  using (public.is_manager_of(employee_id))
  with check (public.is_manager_of(employee_id));

-- --------------------------------------------------------------------------
-- notifications
-- --------------------------------------------------------------------------
create table if not exists public.notifications (
  id               uuid primary key default gen_random_uuid(),
  recipient_id     uuid not null references public.profiles (id) on delete cascade,
  type             text not null default 'GENERAL'
                   check (type in ('LEAVE_REQUEST_SUBMITTED', 'LEAVE_REQUEST_APPROVED', 'LEAVE_REQUEST_REJECTED', 'GENERAL')),
  title            text not null,
  message          text,
  leave_request_id uuid references public.leave_requests (id) on delete cascade,
  is_read          boolean not null default false,
  created_at       timestamptz not null default now()
);

create index if not exists notifications_recipient_idx on public.notifications (recipient_id, created_at desc);
create index if not exists notifications_unread_idx   on public.notifications (recipient_id) where is_read = false;

alter table public.notifications enable row level security;

-- Recipients can read, clear their own rows. Nothing else: inserts happen only
-- via the security-definer triggers below, so users cannot spoof notifications
-- and cannot act on someone else's.
drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own" on public.notifications
  for select to authenticated using (recipient_id = auth.uid());

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own" on public.notifications
  for update to authenticated
  using (recipient_id = auth.uid())
  with check (recipient_id = auth.uid());

drop policy if exists "notifications_delete_own" on public.notifications;
create policy "notifications_delete_own" on public.notifications
  for delete to authenticated using (recipient_id = auth.uid());

-- --------------------------------------------------------------------------
-- Trigger: when an employee submits a leave request, notify their manager
-- (resolved via profiles.manager_id). Security definer so the insert bypasses
-- notifications RLS.
-- --------------------------------------------------------------------------
create or replace function public.notify_manager_on_leave_request()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  mgr uuid;
  EmployeeName text;
begin
  select p.manager_id, p.name into mgr, EmployeeName
  from public.profiles p
  where p.id = new.employee_id;

  if mgr is not null then
    insert into public.notifications (recipient_id, type, title, message, leave_request_id)
    values (
      mgr,
      'LEAVE_REQUEST_SUBMITTED',
      'New leave request from ' || coalesce(EmployeeName, 'your team'),
      'A new leave request is pending your approval ('
        || to_char(new.start_date, 'MM/DD/YYYY')
        || ', '
        || new.duration
        || ').',
      new.id
    );
  end if;
  return new;
end;
$$;

drop trigger if exists on_leave_request_submitted on public.leave_requests;
create trigger on_leave_request_submitted
  after insert on public.leave_requests
  for each row
  execute function public.notify_manager_on_leave_request();

-- Backfill: notify the manager for pending requests that existed before this
-- migration so the badge covers them too.
insert into public.notifications (recipient_id, type, title, message, leave_request_id)
select p.manager_id,
       'LEAVE_REQUEST_SUBMITTED',
       'New leave request from ' || coalesce(p.name, 'your team'),
       'A new leave request is pending your approval ('
         || to_char(lr.start_date, 'MM/DD/YYYY') || ', ' || lr.duration || ').',
       lr.id
from public.leave_requests lr
join public.profiles p on p.id = lr.employee_id
where lr.status = 'Pending' and p.manager_id is not null
  and not exists (
    select 1 from public.notifications n
    where n.leave_request_id = lr.id and n.type = 'LEAVE_REQUEST_SUBMITTED'
  );

-- --------------------------------------------------------------------------
-- Trigger: when a manager approves/rejects (status moves out of Pending),
-- notify the employee with the decision.
-- --------------------------------------------------------------------------
create or replace function public.notify_employee_on_leave_decision()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.status = 'Pending' and new.status in ('Approved', 'Rejected') then
    insert into public.notifications (recipient_id, type, title, message, leave_request_id)
    values (
      new.employee_id,
      'LEAVE_REQUEST_' || upper(new.status),
      'Your leave request was ' || lower(new.status),
      to_char(new.start_date, 'MM/DD/YYYY')
        || ' '
        || new.duration
        || ' request was '
        || lower(new.status)
        || ' by your manager.',
      new.id
    );
  end if;
  return new;
end;
$$;

drop trigger if exists on_leave_request_decision on public.leave_requests;
create trigger on_leave_request_decision
  after update of status on public.leave_requests
  for each row
  when (old.status = 'Pending' and new.status in ('Approved', 'Rejected'))
  execute function public.notify_employee_on_leave_decision();
