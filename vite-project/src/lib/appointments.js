import { isSupabaseConfigured, supabase } from './supabase'

const TABLE = 'appointments'

function requireClient() {
  if (!isSupabaseConfigured || !supabase) {
    return { client: null, error: new Error('Supabase is not configured') }
  }

  return { client: supabase, error: null }
}

/**
 * Fetches all appointments for the admin dashboard (requires authenticated session).
 */
export async function fetchAllAppointments() {
  const { client, error: configError } = requireClient()

  if (configError) {
    return { data: [], error: configError }
  }

  const { data, error } = await client
    .from(TABLE)
    .select('*')
    .order('appointment_date', { ascending: true })
    .order('appointment_time', { ascending: true })

  return { data: data ?? [], error }
}

export async function deleteAppointment(id) {
  const { client, error: configError } = requireClient()

  if (configError) {
    return { error: configError }
  }

  const { error } = await client.from(TABLE).delete().eq('id', id)
  return { error }
}

/** Maps UI status actions to database status values. */
export async function updateAppointmentStatus(id, status) {
  const { client, error: configError } = requireClient()

  if (configError) {
    return { data: null, error: configError }
  }

  const { data, error } = await client
    .from(TABLE)
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}
