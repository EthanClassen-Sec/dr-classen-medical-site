import { motion } from 'motion/react'
import { formatAppointmentDate } from '../../utils/appointmentUtils'
import AppointmentActions from './AppointmentActions'
import AppointmentStatusBadge from './AppointmentStatusBadge'

function DetailRow({ label, value }) {
  return (
    <motion.div className="grid gap-1">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="text-sm text-slate-800">{value || '—'}</dd>
    </motion.div>
  )
}

function AppointmentCard({
  appointment,
  index,
  actionId,
  onApprove,
  onDecline,
  onComplete,
  onCancel,
  onDelete,
}) {
  return (
    <motion.article
      className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/5 transition hover:shadow-md"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      whileHover={{ y: -2 }}
    >
      <motion.div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">
            {appointment.fullName}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {formatAppointmentDate(appointment.appointmentDate)} ·{' '}
            {appointment.appointmentTime}
          </p>
        </div>
        <AppointmentStatusBadge status={appointment.status} />
      </motion.div>

      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        <DetailRow label="Email" value={appointment.email} />
        <DetailRow label="Phone" value={appointment.phone} />
        <DetailRow label="Service" value={appointment.service} />
        <DetailRow label="Patient notes" value={appointment.notes} />
        <DetailRow label="Admin notes" value={appointment.adminNotes} />
      </dl>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <AppointmentActions
          actionId={actionId}
          appointment={appointment}
          onApprove={onApprove}
          onCancel={onCancel}
          onComplete={onComplete}
          onDecline={onDecline}
          onDelete={onDelete}
        />
      </div>
    </motion.article>
  )
}

export default AppointmentCard
