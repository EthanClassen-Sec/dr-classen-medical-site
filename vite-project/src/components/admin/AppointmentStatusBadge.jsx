const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-900 ring-amber-100',
  approved: 'bg-slate-950 text-white ring-slate-900',
  declined: 'bg-rose-50 text-rose-800 ring-rose-100',
  completed: 'bg-emerald-50 text-emerald-800 ring-emerald-100',
  cancelled: 'bg-slate-100 text-slate-500 ring-slate-200',
}

const STATUS_LABELS = {
  pending: 'Pending',
  approved: 'Approved',
  declined: 'Declined',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

function AppointmentStatusBadge({ status }) {
  const key = status in STATUS_STYLES ? status : 'pending'

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset ${STATUS_STYLES[key]}`}
    >
      {STATUS_LABELS[key]}
    </span>
  )
}

export default AppointmentStatusBadge
