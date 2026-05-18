import {
  format,
  isToday,
  isFuture,
  parseISO,
  startOfDay,
} from 'date-fns'

export const APPOINTMENT_STATUSES = [
  'pending',
  'approved',
  'declined',
  'completed',
  'cancelled',
]

/** Statuses that occupy a calendar slot for patients booking online. */
export const ACTIVE_SLOT_STATUSES = ['pending', 'approved']

/**
 * Normalizes appointment rows from Supabase.
 * Supports legacy patient_* columns and full_name / service / notes schemas.
 */
export function normalizeAppointment(row) {
  const status = row.status ?? 'pending'

  return {
    id: row.id,
    createdAt: row.created_at,
    completedAt: row.completed_at,
    fullName: row.full_name ?? row.patient_name ?? '—',
    email: row.email ?? row.patient_email ?? '—',
    phone: row.phone ?? row.patient_phone ?? '—',
    appointmentDate: row.appointment_date,
    appointmentTime: row.appointment_time,
    service: row.service ?? row.reason ?? '—',
    notes: row.notes ?? row.reason ?? '—',
    adminNotes: row.admin_notes ?? '',
    status,
    displayStatus: status,
  }
}

export function getAppointmentDateTime(appointment) {
  const datePart = appointment.appointmentDate ?? ''
  const timePart = appointment.appointmentTime ?? '00:00'
  return parseISO(`${datePart}T${timePart}`)
}

export function sortAppointmentsByDate(appointments) {
  const now = new Date()

  return [...appointments].sort((a, b) => {
    const dateA = getAppointmentDateTime(a)
    const dateB = getAppointmentDateTime(b)

    const aIsFuture = dateA >= startOfDay(now) || isToday(dateA)
    const bIsFuture = dateB >= startOfDay(now) || isToday(dateB)

    if (aIsFuture && !bIsFuture) return -1
    if (!aIsFuture && bIsFuture) return 1

    return dateA - dateB
  })
}

export function filterAppointments(appointments, filter) {
  if (filter === 'all') {
    return appointments
  }

  if (filter === 'today') {
    return appointments.filter((appointment) =>
      isToday(parseISO(appointment.appointmentDate)),
    )
  }

  if (APPOINTMENT_STATUSES.includes(filter)) {
    return appointments.filter((appointment) => appointment.status === filter)
  }

  return appointments
}

export function searchAppointments(appointments, query) {
  const term = query.trim().toLowerCase()

  if (!term) {
    return appointments
  }

  return appointments.filter((appointment) => {
    const haystack = [
      appointment.fullName,
      appointment.email,
      appointment.phone,
      appointment.service,
      appointment.notes,
      appointment.adminNotes,
      appointment.appointmentDate,
      appointment.appointmentTime,
      appointment.status,
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(term)
  })
}

export function getAppointmentStats(appointments) {
  const todayCount = appointments.filter((a) =>
    isToday(parseISO(a.appointmentDate)),
  ).length

  const pendingCount = appointments.filter((a) => a.status === 'pending').length
  const approvedCount = appointments.filter((a) => a.status === 'approved').length

  const upcomingCount = appointments.filter(
    (a) =>
      ['pending', 'approved'].includes(a.status) &&
      (isToday(parseISO(a.appointmentDate)) ||
        isFuture(startOfDay(parseISO(a.appointmentDate)))),
  ).length

  return {
    total: appointments.length,
    today: todayCount,
    pending: pendingCount,
    approved: approvedCount,
    upcoming: upcomingCount,
    completed: appointments.filter((a) => a.status === 'completed').length,
    declined: appointments.filter((a) => a.status === 'declined').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  }
}

export function formatAppointmentDate(dateString) {
  if (!dateString) return '—'
  return format(parseISO(dateString), 'EEE, d MMM yyyy')
}
