import { isSupabaseConfigured, supabase } from './supabase'

const TABLE = 'appointments'

function requireClient() {
  if (!isSupabaseConfigured || !supabase) {
    return { client: null, error: new Error('Supabase is not configured') }
  }

  return { client: supabase, error: null }
}

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

async function patchAppointment(id, fields) {
  const { client, error: configError } = requireClient()

  if (configError) {
    return { data: null, error: configError }
  }

  const { data, error } = await client
    .from(TABLE)
    .update(fields)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

export async function approveAppointment(id, adminNotes = '') {
  return patchAppointment(id, {
    status: 'approved',
    admin_notes: adminNotes || null,
  })
}

export async function declineAppointment(id, adminNotes = '') {
  return patchAppointment(id, {
    status: 'declined',
    admin_notes: adminNotes || null,
  })
}

export async function cancelAppointment(id, adminNotes = '') {
  return patchAppointment(id, {
    status: 'cancelled',
    admin_notes: adminNotes || null,
  })
}

export async function completeAppointment(id, adminNotes = '') {
  return patchAppointment(id, {
    status: 'completed',
    admin_notes: adminNotes || null,
    completed_at: new Date().toISOString(),
  })
}
