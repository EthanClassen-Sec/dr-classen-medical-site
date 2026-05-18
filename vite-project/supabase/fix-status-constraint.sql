-- Run this FIRST if clinic-workflow.sql failed on status migration.
-- Safe to run multiple times.

-- 1) Remove old constraint so we can use new status values
alter table public.appointments drop constraint if exists appointments_status_check;

-- 2) Add missing columns (no-op if they already exist)
alter table public.appointments
  add column if not exists admin_notes text,
  add column if not exists completed_at timestamptz;

-- 3) Normalize existing rows
update public.appointments set status = 'approved' where status = 'booked';
update public.appointments set status = 'pending' where status is null;
update public.appointments
set status = 'pending'
where status not in ('pending', 'approved', 'declined', 'completed', 'cancelled');

-- 4) Apply the new workflow constraint
alter table public.appointments
  add constraint appointments_status_check
  check (status in ('pending', 'approved', 'declined', 'completed', 'cancelled'));

alter table public.appointments
  alter column status set default 'pending';

-- 5) Active slot index
drop index if exists public.appointments_unique_booked_slot;
drop index if exists public.appointments_unique_active_slot;

create unique index if not exists appointments_unique_active_slot
  on public.appointments (appointment_date, appointment_time)
  where status in ('pending', 'approved');

-- Quick check
select id, status, appointment_date, appointment_time, patient_name
from public.appointments
order by created_at desc
limit 10;

notify pgrst, 'reload schema';
