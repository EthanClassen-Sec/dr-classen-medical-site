import { isSupabaseConfigured, supabase } from '../lib/supabase'

function requireClient() {
  if (!isSupabaseConfigured || !supabase) {
    return { client: null, error: new Error('Supabase is not configured') }
  }

  return { client: supabase, error: null }
}

/** Lists clinic profiles (super_admin sees all via RLS). */
export async function fetchClinicUsers() {
  const { client, error: configError } = requireClient()

  if (configError) {
    return { data: [], error: configError }
  }

  const { data, error } = await client
    .from('profiles')
    .select('id, email, full_name, role, created_at')
    .order('created_at', { ascending: false })

  return { data: data ?? [], error }
}

/**
 * Creates a clinic user via Edge Function (service role stays server-side).
 * Only callable by authenticated super_admin users.
 */
export async function createClinicUser({ email, password, fullName, role }) {
  const { client, error: configError } = requireClient()

  if (configError) {
    return { data: null, error: configError }
  }

  const { data, error } = await client.functions.invoke('create-clinic-user', {
    body: {
      email,
      password,
      full_name: fullName,
      role,
    },
  })

  if (error) {
    return { data: null, error }
  }

  if (data?.error) {
    return { data: null, error: new Error(data.error) }
  }

  return { data: data?.user ?? null, error: null }
}
