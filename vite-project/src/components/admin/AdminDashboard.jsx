import { useMemo } from 'react'
import { motion } from 'motion/react'
import { getAppointmentStats } from '../../utils/appointmentUtils'
import AppointmentFilters from './AppointmentFilters'
import AppointmentList from './AppointmentList'
import StatsCards from './StatsCards'

function AdminDashboard({
  activeFilter,
  onFilterChange,
  appointments,
  allAppointments,
  isLoading,
  error,
  actionId,
  refresh,
  deleteAppointment,
  completeAppointment,
  cancelAppointment,
}) {
  const stats = useMemo(
    () => getAppointmentStats(allAppointments),
    [allAppointments],
  )

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          Overview of patient bookings for Dr. Lynette Classen. Appointments are
          sorted by the nearest visit first.
        </p>
      </motion.section>

      <StatsCards stats={stats} />

      <section className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Appointment schedule
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {appointments.length} result{appointments.length === 1 ? '' : 's'}
            </p>
          </div>
          <AppointmentFilters
            activeFilter={activeFilter}
            onChange={onFilterChange}
          />
        </div>

        {error && (
          <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </p>
        )}

        <AppointmentList
          actionId={actionId}
          activeFilter={activeFilter}
          appointments={appointments}
          isLoading={isLoading}
          onCancel={cancelAppointment}
          onComplete={completeAppointment}
          onDelete={deleteAppointment}
        />
      </section>

      <button
        className="fixed bottom-6 right-6 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-slate-950/20 transition hover:bg-teal-800 sm:hidden"
        onClick={refresh}
        type="button"
      >
        Refresh
      </button>
    </div>
  )
}

export default AdminDashboard
