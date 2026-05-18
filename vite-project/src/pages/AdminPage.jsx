import { useState } from 'react'
import AdminDashboard from '../components/admin/AdminDashboard'
import AdminLayout from '../components/admin/AdminLayout'
import AdminLogin from '../components/admin/AdminLogin'
import { useAuth } from '../context/AuthContext'
import { useAppointments } from '../hooks/useAppointments'

function AdminPage() {
  const {
    user,
    profile,
    isAuthenticated,
    isClinicStaff,
    isLoading: isAuthLoading,
    authError,
    signIn,
    signOut,
    isSupabaseConfigured,
  } = useAuth()

  const [activeFilter, setActiveFilter] = useState('pending')
  const [searchQuery, setSearchQuery] = useState('')

  const appointmentState = useAppointments({
    activeFilter,
    searchQuery,
    enabled: isAuthenticated && isClinicStaff && !isAuthLoading,
  })

  if (isAuthLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 px-6">
        <div className="text-center">
          <p className="text-sm font-medium text-slate-500">Loading dashboard...</p>
          {!isSupabaseConfigured && (
            <p className="mt-3 text-sm text-amber-800">
              Supabase is not configured. Add VITE_SUPABASE_URL and
              VITE_SUPABASE_ANON_KEY to your .env file.
            </p>
          )}
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !isClinicStaff) {
    return (
      <AdminLogin
        authError={
          authError ||
          (isAuthenticated && !isClinicStaff
            ? 'Signed in, but no clinic profile or role was found. Ask a super admin to add your account to the profiles table.'
            : '')
        }
        isLoading={false}
        isSupabaseConfigured={isSupabaseConfigured}
        onSignIn={signIn}
      />
    )
  }

  return (
    <AdminLayout
      onRefresh={appointmentState.refresh}
      onSignOut={signOut}
      userEmail={user?.email}
      userRole={profile?.role}
    >
      <AdminDashboard
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
        {...appointmentState}
      />
    </AdminLayout>
  )
}

export default AdminPage
