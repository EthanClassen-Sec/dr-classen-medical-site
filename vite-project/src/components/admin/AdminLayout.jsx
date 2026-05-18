import { useState } from 'react'
import { motion } from 'motion/react'
import { getRoleLabel } from '../../lib/permissions'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'

function AdminLayout({ children, onRefresh, onSignOut, userEmail, userRole }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex min-h-screen">
        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          userRole={userRole}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader
            onMenuToggle={() => setIsSidebarOpen(true)}
            onRefresh={onRefresh}
            onSignOut={onSignOut}
            subtitle={userRole ? getRoleLabel(userRole) : ''}
            userEmail={userEmail}
          />
          <motion.main
            className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
          >
            {children}
          </motion.main>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
