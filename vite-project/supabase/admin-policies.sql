-- Run this in the Supabase SQL editor after appointments.sql
-- Enables admin dashboard: completed status + authenticated admin access

-- Allow completed visits in addition to booked / cancelled
alter table public.appointments drop constraint if exists appointments_status_check;

alter table public.appointments
  add constraint appointments_status_check
  check (status in ('booked', 'completed', 'cancelled'));

grant select, insert, update, delete on public.appointments to authenticated;

drop policy if exists "Admins can view all appointments" on public.appointments;
create policy "Admins can view all appointments"
  on public.appointments
  for select
  to authenticated
  using (true);

drop policy if exists "Admins can update appointments" on public.appointments;
create policy "Admins can update appointments"
  on public.appointments
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admins can delete appointments" on public.appointments;
create policy "Admins can delete appointments"
  on public.appointments
  for delete
  to authenticated
  using (true);

notify pgrst, 'reload schema';
