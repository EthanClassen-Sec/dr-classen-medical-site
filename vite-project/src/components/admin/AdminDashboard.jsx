import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { getAppointmentStats } from '../../utils/appointmentUtils'
import ActionNotesModal from './ActionNotesModal'
import AppointmentFilters from './AppointmentFilters'
import AppointmentList from './AppointmentList'
import AppointmentSearch from './AppointmentSearch'
import StatsCards from './StatsCards'

function AdminDashboard({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  appointments,
  allAppointments,
  isLoading,
  error,
  actionId,
  refresh,
  approveAppointment,
  declineAppointment,
  cancelAppointment,
  completeAppointment,
  deleteAppointment,
}) {
  const [modal, setModal] = useState(null)

  const stats = useMemo(
    () => getAppointmentStats(allAppointments),
    [allAppointments],
  )

  function openModal(type, appointment) {
    setModal({ type, appointment })
  }

  function closeModal() {
    setModal(null)
  }

  async function handleModalConfirm(notes) {
    if (!modal) {
      return
    }

    const { type, appointment } = modal

    if (type === 'approve') {
      await approveAppointment(appointment.id, notes)
    } else if (type === 'decline') {
      await declineAppointment(appointment.id, notes)
    } else if (type === 'cancel') {
      await cancelAppointment(appointment.id, notes)
    } else if (type === 'complete') {
      await completeAppointment(appointment.id, notes)
    }

    closeModal()
  }

  const modalConfig = {
    approve: {
      title: 'Approve appointment',
      description: `Confirm the visit for ${modal?.appointment?.fullName}. A confirmation notification placeholder will run.`,
      confirmLabel: 'Approve',
      confirmTone: 'primary',
    },
    decline: {
      title: 'Decline appointment',
      description: `Decline the request from ${modal?.appointment?.fullName}. Add an optional reason for the patient notification placeholder.`,
      confirmLabel: 'Decline',
      confirmTone: 'danger',
    },
    cancel: {
      title: 'Cancel appointment',
      description: `Cancel this appointment for ${modal?.appointment?.fullName}.`,
      confirmLabel: 'Cancel appointment',
      confirmTone: 'danger',
    },
    complete: {
      title: 'Mark as completed',
      description: `Mark ${modal?.appointment?.fullName}'s visit as completed.`,
      confirmLabel: 'Mark completed',
      confirmTone: 'primary',
    },
  }

  const activeModal = modal ? modalConfig[modal.type] : null

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          Review patient requests, approve or decline bookings, and manage the
          clinic schedule for Dr. Lynette Classen.
        </p>
      </section>

      <StatsCards stats={stats} />

      <section className="space-y-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Appointment schedule
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {appointments.length} result{appointments.length === 1 ? '' : 's'}
            </p>
          </div>
          <AppointmentSearch onChange={onSearchChange} value={searchQuery} />
        </div>

        <AppointmentFilters activeFilter={activeFilter} onChange={onFilterChange} />

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
          onApprove={(appointment) => openModal('approve', appointment)}
          onCancel={(appointment) => openModal('cancel', appointment)}
          onComplete={(appointment) => openModal('complete', appointment)}
          onDecline={(appointment) => openModal('decline', appointment)}
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

      <ActionNotesModal
        confirmLabel={activeModal?.confirmLabel}
        confirmTone={activeModal?.confirmTone}
        description={activeModal?.description}
        isOpen={Boolean(modal)}
        isSubmitting={Boolean(actionId)}
        onClose={closeModal}
        onConfirm={handleModalConfirm}
        title={activeModal?.title}
      />
    </div>
  )
}

export default AdminDashboard
