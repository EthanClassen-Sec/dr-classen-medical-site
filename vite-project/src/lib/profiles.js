import { isSupabaseConfigured, supabase } from './supabase'

/**
 * Loads a clinic profile by auth user id.
 * Prefer this over getUser() during auth bootstrap to avoid Supabase auth deadlocks.
 */
export async function fetchProfileByUserId(userId) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: new Error('Supabase is not configured') }
  }

  if (!userId) {
    return { data: null, error: new Error('Missing user id') }
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, created_at')
    .eq('id', userId)
    .maybeSingle()

  return { data, error }
}

/** @deprecated Prefer fetchProfileByUserId(session.user.id) when session is available */
export async function fetchCurrentProfile() {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: new Error('Supabase is not configured') }
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session?.user) {
    return {
      data: null,
      error: sessionError ?? new Error('Not authenticated'),
    }
  }

  return fetchProfileByUserId(session.user.id)
}
