import { motion } from 'motion/react'
import { formatAppointmentDate } from '../../utils/appointmentUtils'
import AppointmentActions from './AppointmentActions'
import AppointmentStatusBadge from './AppointmentStatusBadge'

function AppointmentTable({
  appointments,
  actionId,
  onApprove,
  onDecline,
  onComplete,
  onCancel,
  onDelete,
}) {
  return (
    <motion.div
      className="hidden overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/5 lg:block"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/80">
            <tr>
              {[
                'Patient',
                'Contact',
                'Date',
                'Time',
                'Service',
                'Notes',
                'Admin notes',
                'Status',
                'Actions',
              ].map((heading) => (
                <th
                  className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                  key={heading}
                  scope="col"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {appointments.map((appointment, index) => (
              <motion.tr
                className="transition hover:bg-slate-50/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={appointment.id}
                transition={{ delay: index * 0.03 }}
              >
                <td className="px-5 py-4 font-semibold text-slate-950">
                  {appointment.fullName}
                </td>
                <td className="px-5 py-4">
                  <p className="text-slate-800">{appointment.email}</p>
                  <p className="mt-1 text-slate-500">{appointment.phone}</p>
                </td>
                <td className="px-5 py-4 text-slate-700">
                  {formatAppointmentDate(appointment.appointmentDate)}
                </td>
                <td className="px-5 py-4 text-slate-700">
                  {appointment.appointmentTime}
                </td>
                <td className="max-w-[10rem] px-5 py-4 text-slate-700">
                  <p className="line-clamp-2">{appointment.service}</p>
                </td>
                <td className="max-w-[10rem] px-5 py-4 text-slate-600">
                  <p className="line-clamp-2">{appointment.notes}</p>
                </td>
                <td className="max-w-[10rem] px-5 py-4 text-slate-600">
                  <p className="line-clamp-2">{appointment.adminNotes || '—'}</p>
                </td>
                <td className="px-5 py-4">
                  <AppointmentStatusBadge status={appointment.status} />
                </td>
                <td className="px-5 py-4">
                  <AppointmentActions
                    actionId={actionId}
                    appointment={appointment}
                    onApprove={onApprove}
                    onCancel={onCancel}
                    onComplete={onComplete}
                    onDecline={onDecline}
                    onDelete={onDelete}
                  />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

export default AppointmentTable
