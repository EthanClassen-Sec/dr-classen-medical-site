import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { fetchProfileByUserId } from '../lib/profiles'
import { can, isClinicStaff } from '../lib/permissions'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authError, setAuthError] = useState('')

  const loadProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null)
      return { data: null, error: new Error('Missing user id') }
    }

    const { data, error } = await fetchProfileByUserId(userId)

    if (error) {
      setProfile(null)
      return { data: null, error }
    }

    setProfile(data)
    return { data, error: null }
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoading(false)
      return undefined
    }

    let isActive = true

    async function bootstrap() {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (!isActive) {
          return
        }

        if (error) {
          console.error('Auth session error', error)
          setSession(null)
          setProfile(null)
          return
        }

        const nextSession = data.session
        setSession(nextSession)

        if (nextSession?.user?.id) {
          await loadProfile(nextSession.user.id)
        } else {
          setProfile(null)
        }
      } catch (error) {
        console.error('Auth bootstrap failed', error)
        setSession(null)
        setProfile(null)
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    bootstrap()

    // Never await Supabase calls directly inside this callback — it can deadlock.
    // See: https://supabase.com/docs/reference/javascript/auth-onauthstatechange
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setTimeout(async () => {
        if (!isActive) {
          return
        }

        setSession(nextSession)

        try {
          if (nextSession?.user?.id) {
            await loadProfile(nextSession.user.id)
          } else {
            setProfile(null)
          }
        } catch (error) {
          console.error('Auth state profile load failed', error)
          setProfile(null)
        } finally {
          if (isActive) {
            setIsLoading(false)
          }
        }
      }, 0)
    })

    return () => {
      isActive = false
      subscription.unsubscribe()
    }
  }, [loadProfile])

  const signIn = useCallback(
    async (email, password) => {
      setAuthError('')

      if (!isSupabaseConfigured || !supabase) {
        setAuthError('Supabase is not configured.')
        return { success: false }
      }

      setIsLoading(true)

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          setAuthError(error.message)
          return { success: false }
        }

        setSession(data.session)
        const profileResult = await loadProfile(data.session?.user?.id)

        if (!profileResult.data || !isClinicStaff(profileResult.data.role)) {
          await supabase.auth.signOut()
          setSession(null)
          setProfile(null)
          setAuthError('Your account does not have clinic dashboard access.')
          return { success: false }
        }

        return { success: true }
      } finally {
        setIsLoading(false)
      }
    },
    [loadProfile],
  )

  const signOut = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }

    setSession(null)
    setProfile(null)
  }, [])

  const hasPermission = useCallback(
    (permission) => can(profile?.role, permission),
    [profile?.role],
  )

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      role: profile?.role ?? null,
      isAuthenticated: Boolean(session),
      isClinicStaff: isClinicStaff(profile?.role),
      isLoading,
      authError,
      signIn,
      signOut,
      hasPermission,
      refreshProfile: () => loadProfile(session?.user?.id),
      isSupabaseConfigured,
    }),
    [
      session,
      profile,
      isLoading,
      authError,
      signIn,
      signOut,
      hasPermission,
      loadProfile,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
