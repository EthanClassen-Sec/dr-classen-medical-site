import { useCallback, useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

/**
 * Supabase Auth session for the admin dashboard.
 * Create an admin user in Supabase Authentication before signing in.
 */
export function useAdminAuth() {
  const [session, setSession] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoading(false)
      return undefined
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setIsLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = useCallback(async (email, password) => {
    setAuthError('')

    if (!isSupabaseConfigured || !supabase) {
      setAuthError('Supabase is not configured.')
      return { success: false }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setAuthError(error.message)
      return { success: false }
    }

    setSession(data.session)
    return { success: true }
  }, [])

  const signOut = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    setSession(null)
  }, [])

  return {
    session,
    user: session?.user ?? null,
    isAuthenticated: Boolean(session),
    isLoading,
    authError,
    signIn,
    signOut,
    isSupabaseConfigured,
  }
}
