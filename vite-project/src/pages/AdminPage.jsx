import { motion } from 'motion/react'
import { useState } from 'react'
import AdminDashboard from '../components/admin/AdminDashboard'
import AdminLayout from '../components/admin/AdminLayout'
import AdminLogin from '../components/admin/AdminLogin'
import { useAdminAuth } from '../hooks/useAdminAuth'
import { useAppointments } from '../hooks/useAppointments'

function AdminPage() {
  const {
    user,
    isAuthenticated,
    isLoading: isAuthLoading,
    authError,
    signIn,
    signOut,
    isSupabaseConfigured,
  } = useAdminAuth()

  const [activeFilter, setActiveFilter] = useState('upcoming')

  const appointmentState = useAppointments(
    activeFilter,
    isAuthenticated && !isAuthLoading,
  )

  if (isAuthLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          className="text-sm font-medium text-slate-500"
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          Loading dashboard...
        </motion.p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <AdminLogin
        authError={authError}
        isLoading={isAuthLoading}
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
    >
      <AdminDashboard
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        {...appointmentState}
      />
    </AdminLayout>
  )
}

export default AdminPage
