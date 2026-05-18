-- Base appointments table for Dr. Classen online booking
-- Run clinic-workflow.sql after this for approval workflow + profiles

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  appointment_date date not null,
  appointment_time text not null,
  patient_name text not null,
  patient_phone text not null,
  patient_email text not null,
  reason text not null,
  status text not null default 'pending',
  admin_notes text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint appointments_status_check
    check (status in ('pending', 'approved', 'declined', 'completed', 'cancelled'))
);

alter table public.appointments enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert on public.appointments to anon, authenticated;

drop policy if exists "Public can view active slot times" on public.appointments;
create policy "Public can view active slot times"
  on public.appointments
  for select
  to anon, authenticated
  using (status in ('pending', 'approved'));

drop policy if exists "Public can request pending appointments" on public.appointments;
create policy "Public can request pending appointments"
  on public.appointments
  for insert
  to anon, authenticated
  with check (status = 'pending');

create unique index if not exists appointments_unique_active_slot
  on public.appointments (appointment_date, appointment_time)
  where status in ('pending', 'approved');

notify pgrst, 'reload schema';
