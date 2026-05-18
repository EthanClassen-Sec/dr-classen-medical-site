create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  appointment_date date not null,
  appointment_time text not null,
  patient_name text not null,
  patient_phone text not null,
  patient_email text not null,
  reason text not null,
  status text not null default 'booked',
  created_at timestamptz not null default now(),
  constraint appointments_status_check check (status in ('booked', 'cancelled'))
);

alter table public.appointments
  add column if not exists appointment_date date,
  add column if not exists appointment_time text,
  add column if not exists patient_name text,
  add column if not exists patient_phone text,
  add column if not exists patient_email text,
  add column if not exists reason text,
  add column if not exists status text default 'booked',
  add column if not exists created_at timestamptz default now();

update public.appointments
set status = 'booked'
where status is null;

alter table public.appointments
  alter column status set not null,
  alter column created_at set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'appointments_status_check'
      and conrelid = 'public.appointments'::regclass
  ) then
    alter table public.appointments
      add constraint appointments_status_check
      check (status in ('booked', 'cancelled'));
  end if;
end $$;

create unique index if not exists appointments_unique_booked_slot
  on public.appointments (appointment_date, appointment_time)
  where status = 'booked';

alter table public.appointments enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert on public.appointments to anon, authenticated;

drop policy if exists "Anyone can view booked appointment slots"
  on public.appointments;

create policy "Anyone can view booked appointment slots"
  on public.appointments
  for select
  using (status = 'booked');

drop policy if exists "Anyone can request an appointment"
  on public.appointments;

create policy "Anyone can request an appointment"
  on public.appointments
  for insert
  with check (status = 'booked');

notify pgrst, 'reload schema';
