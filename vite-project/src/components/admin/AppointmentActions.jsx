import { motion } from 'motion/react'
import { PERMISSIONS } from '../../lib/permissions'
import { useAuth } from '../../context/AuthContext'

function AppointmentActions({
  appointment,
  actionId,
  onApprove,
  onDecline,
  onComplete,
  onCancel,
  onDelete,
}) {
  const { hasPermission } = useAuth()
  const isBusy = actionId === appointment.id
  const { status } = appointment

  const canApprove = hasPermission(PERMISSIONS.APPROVE_APPOINTMENTS) && status === 'pending'
  const canDecline = hasPermission(PERMISSIONS.APPROVE_APPOINTMENTS) && status === 'pending'
  const canComplete =
    hasPermission(PERMISSIONS.MANAGE_APPOINTMENTS) && status === 'approved'
  const canCancel =
    hasPermission(PERMISSIONS.MANAGE_APPOINTMENTS) &&
    ['pending', 'approved'].includes(status)
  const canDelete = hasPermission(PERMISSIONS.DELETE_APPOINTMENTS)

  return (
    <motion.div className="flex flex-wrap items-center gap-2">
      {canApprove && (
        <button
          className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-teal-800 disabled:opacity-50"
          disabled={isBusy}
          onClick={() => onApprove(appointment)}
          type="button"
        >
          Approve
        </button>
      )}
      {canDecline && (
        <button
          className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:opacity-50"
          disabled={isBusy}
          onClick={() => onDecline(appointment)}
          type="button"
        >
          Decline
        </button>
      )}
      {canComplete && (
        <button
          className="rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50"
          disabled={isBusy}
          onClick={() => onComplete(appointment)}
          type="button"
        >
          Complete
        </button>
      )}
      {canCancel && (
        <button
          className="rounded-full px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
          disabled={isBusy}
          onClick={() => onCancel(appointment)}
          type="button"
        >
          Cancel
        </button>
      )}
      {canDelete && (
        <button
          className="rounded-full px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
          disabled={isBusy}
          onClick={() => {
            if (
              window.confirm(
                `Delete appointment for ${appointment.fullName}? This cannot be undone.`,
              )
            ) {
              onDelete(appointment.id)
            }
          }}
          type="button"
        >
          Delete
        </button>
      )}
    </motion.div>
  )
}

export default AppointmentActions
