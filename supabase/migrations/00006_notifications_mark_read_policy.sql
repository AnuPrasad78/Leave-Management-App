-- 00006_notifications_mark_read_policy.sql
-- Mark-as-read needs an UPDATE policy; 00005 only shipped select/delete, so
-- recipients could never clear their unread badge (updates matched 0 rows).
-- Runs after 00005. Re-runnable.

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own" on public.notifications
  for update to authenticated
  using (recipient_id = auth.uid())
  with check (recipient_id = auth.uid());
