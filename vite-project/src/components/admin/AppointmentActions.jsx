import { motion } from 'motion/react'

function AppointmentActions({
  appointment,
  actionId,
  onComplete,
  onCancel,
  onDelete,
}) {
  const isBusy = actionId === appointment.id
  const canModify = appointment.displayStatus === 'upcoming'

  return (
    <motion.div className="flex flex-wrap items-center gap-2">
      {canModify && (
        <>
          <button
            className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50"
            disabled={isBusy}
            onClick={() => onComplete(appointment.id)}
            type="button"
          >
            Complete
          </button>
          <button
            className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:opacity-50"
            disabled={isBusy}
            onClick={() => onCancel(appointment.id)}
            type="button"
          >
            Cancel
          </button>
        </>
      )}
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
    </motion.div>
  )
}

export default AppointmentActions
