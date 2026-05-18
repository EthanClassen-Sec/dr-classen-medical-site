-- Clinic management workflow migration
-- Run in Supabase SQL editor after appointments.sql

-- ---------------------------------------------------------------------------
-- Profiles (linked to auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null,
  role text not null default 'receptionist'
    check (role in ('super_admin', 'admin', 'doctor', 'receptionist')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);

-- ---------------------------------------------------------------------------
-- Appointments: workflow columns + statuses
-- ---------------------------------------------------------------------------
alter table public.appointments
  add column if not exists admin_notes text,
  add column if not exists completed_at timestamptz;

-- Drop the OLD check constraint BEFORE migrating statuses (booked → approved fails otherwise)
alter table public.appointments drop constraint if exists appointments_status_check;

-- Migrate legacy statuses into the new workflow
update public.appointments
set status = 'approved'
where status = 'booked';

update public.appointments
set status = 'pending'
where status is null;

-- Any other unknown legacy values become pending so the new constraint can be applied
update public.appointments
set status = 'pending'
where status is not null
  and status not in ('pending', 'approved', 'declined', 'completed', 'cancelled');

alter table public.appointments
  add constraint appointments_status_check
  check (status in ('pending', 'approved', 'declined', 'completed', 'cancelled'));

alter table public.appointments
  alter column status set default 'pending';

-- Active slots: pending requests and approved visits block the calendar
drop index if exists public.appointments_unique_booked_slot;
drop index if exists public.appointments_unique_active_slot;

create unique index if not exists appointments_unique_active_slot
  on public.appointments (appointment_date, appointment_time)
  where status in ('pending', 'approved');

-- ---------------------------------------------------------------------------
-- Role helpers (security definer for RLS)
-- ---------------------------------------------------------------------------
create or replace function public.get_my_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.has_clinic_role(allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role from public.profiles where id = auth.uid()) = any (allowed_roles),
    false
  );
$$;

revoke all on function public.get_my_role() from public;
revoke all on function public.has_clinic_role(text[]) from public;
grant execute on function public.get_my_role() to authenticated;
grant execute on function public.has_clinic_role(text[]) to authenticated;

-- ---------------------------------------------------------------------------
-- Profiles RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;

grant select on public.profiles to authenticated;
grant insert, update, delete on public.profiles to authenticated;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

drop policy if exists "Staff can view all profiles" on public.profiles;
create policy "Staff can view all profiles"
  on public.profiles
  for select
  to authenticated
  using (public.has_clinic_role(array['super_admin', 'admin', 'doctor', 'receptionist']));

drop policy if exists "Super admin can manage profiles" on public.profiles;
create policy "Super admin can manage profiles"
  on public.profiles
  for all
  to authenticated
  using (public.get_my_role() = 'super_admin')
  with check (public.get_my_role() = 'super_admin');

-- ---------------------------------------------------------------------------
-- Appointments RLS (replace legacy policies)
-- ---------------------------------------------------------------------------
grant select, insert, update, delete on public.appointments to authenticated;

drop policy if exists "Anyone can view booked appointment slots" on public.appointments;
drop policy if exists "Anyone can request an appointment" on public.appointments;
drop policy if exists "Admins can view all appointments" on public.appointments;
drop policy if exists "Admins can update appointments" on public.appointments;
drop policy if exists "Admins can delete appointments" on public.appointments;

-- Public: see occupied slots only (no patient details leakage beyond time)
drop policy if exists "Public can view active slot times" on public.appointments;
create policy "Public can view active slot times"
  on public.appointments
  for select
  to anon, authenticated
  using (status in ('pending', 'approved'));

-- Public: submit pending requests only
drop policy if exists "Public can request pending appointments" on public.appointments;
create policy "Public can request pending appointments"
  on public.appointments
  for insert
  to anon, authenticated
  with check (status = 'pending');

-- Staff: full read access
drop policy if exists "Staff can view all appointments" on public.appointments;
create policy "Staff can view all appointments"
  on public.appointments
  for select
  to authenticated
  using (public.has_clinic_role(array['super_admin', 'admin', 'doctor', 'receptionist']));

-- Staff updates (approve/decline restricted to admin roles in WITH CHECK)
drop policy if exists "Staff can update appointments" on public.appointments;
create policy "Staff can update appointments"
  on public.appointments
  for update
  to authenticated
  using (public.has_clinic_role(array['super_admin', 'admin', 'receptionist']))
  with check (
    public.has_clinic_role(array['super_admin', 'admin'])
    or (
      public.has_clinic_role(array['receptionist'])
      and status not in ('approved', 'declined')
    )
  );

-- Delete: admin roles only
drop policy if exists "Admins can delete appointments" on public.appointments;
create policy "Admins can delete appointments"
  on public.appointments
  for delete
  to authenticated
  using (public.has_clinic_role(array['super_admin', 'admin']));

-- ---------------------------------------------------------------------------
-- Bootstrap first super_admin (run once after creating auth user in dashboard)
-- ---------------------------------------------------------------------------
-- insert into public.profiles (id, email, full_name, role)
-- values (
--   '<auth-user-uuid>',
--   'admin@example.com',
--   'Clinic Super Admin',
--   'super_admin'
-- );

notify pgrst, 'reload schema';
