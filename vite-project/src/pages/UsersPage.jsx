import AdminLayout from '../components/admin/AdminLayout'
import UsersPanel from '../components/admin/UsersPanel'
import { useAuth } from '../context/AuthContext'
import { PERMISSIONS } from '../lib/permissions'
import { useRouter } from '../lib/router'

function UsersPage() {
  const { hasPermission, profile, signOut, user } = useAuth()
  const { navigate } = useRouter()

  if (!hasPermission(PERMISSIONS.MANAGE_USERS)) {
    return (
      <AdminLayout
        onRefresh={() => {}}
        onSignOut={signOut}
        userEmail={user?.email}
        userRole={profile?.role}
      >
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-sm text-slate-600">Super admin access required.</p>
          <button
            className="mt-4 text-sm font-semibold text-slate-950 underline"
            onClick={() => navigate('/admin')}
            type="button"
          >
            Back to dashboard
          </button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      onRefresh={() => {}}
      onSignOut={signOut}
      userEmail={user?.email}
      userRole={profile?.role}
    >
      <UsersPanel />
    </AdminLayout>
  )
}

export default UsersPage
