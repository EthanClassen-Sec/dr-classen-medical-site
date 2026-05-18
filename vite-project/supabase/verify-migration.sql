-- Run AFTER clinic-workflow.sql to confirm everything applied correctly.

-- 1) Profiles table exists
select column_name, data_type
from information_schema.columns
where table_schema = 'public' and table_name = 'profiles'
order by ordinal_position;

-- 2) Appointments has new columns + statuses
select column_name, data_type
from information_schema.columns
where table_schema = 'public' and table_name = 'appointments'
  and column_name in ('status', 'admin_notes', 'completed_at')
order by column_name;

-- 3) Status constraint allows workflow values
select conname, pg_get_constraintdef(oid) as definition
from pg_constraint
where conrelid = 'public.appointments'::regclass
  and conname = 'appointments_status_check';

-- 4) Active slot unique index
select indexname, indexdef
from pg_indexes
where tablename = 'appointments'
  and indexname = 'appointments_unique_active_slot';

-- 5) RLS enabled
select relname, relrowsecurity
from pg_class
where relname in ('appointments', 'profiles');

-- 6) Your super_admin profile (replace email if needed)
select id, email, full_name, role, created_at
from public.profiles
order by created_at desc;

-- 7) Appointment status breakdown
select status, count(*) as total
from public.appointments
group by status
order by status;
