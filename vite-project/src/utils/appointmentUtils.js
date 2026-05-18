import {
  format,
  isToday,
  isFuture,
  parseISO,
  startOfDay,
} from 'date-fns'

/**
 * Normalizes appointment rows from Supabase.
 * Supports both legacy patient_* columns and full_name / service / notes schemas.
 */
export function normalizeAppointment(row) {
  const status = row.status ?? 'booked'
  const displayStatus =
    status === 'booked' ? 'upcoming' : status === 'completed' ? 'completed' : 'cancelled'

  return {
    id: row.id,
    createdAt: row.created_at,
    fullName: row.full_name ?? row.patient_name ?? '—',
    email: row.email ?? row.patient_email ?? '—',
    phone: row.phone ?? row.patient_phone ?? '—',
    appointmentDate: row.appointment_date,
    appointmentTime: row.appointment_time,
    service: row.service ?? row.reason ?? '—',
    notes: row.notes ?? row.reason ?? '—',
    status,
    displayStatus,
  }
}

/** Combines date + time into a sortable timestamp. */
export function getAppointmentDateTime(appointment) {
  const datePart = appointment.appointmentDate ?? ''
  const timePart = appointment.appointmentTime ?? '00:00'
  return parseISO(`${datePart}T${timePart}`)
}

/** Nearest upcoming appointments first; past dates sink to the bottom. */
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

  return appointments.filter((appointment) => {
    const date = parseISO(appointment.appointmentDate)

    if (filter === 'today') {
      return isToday(date)
    }

    if (filter === 'upcoming') {
      return (
        appointment.displayStatus === 'upcoming' &&
        (isToday(date) || isFuture(startOfDay(date)))
      )
    }

    return true
  })
}

export function getAppointmentStats(appointments) {
  const todayCount = appointments.filter((a) =>
    isToday(parseISO(a.appointmentDate)),
  ).length

  const upcomingCount = appointments.filter(
    (a) =>
      a.displayStatus === 'upcoming' &&
      (isToday(parseISO(a.appointmentDate)) ||
        isFuture(startOfDay(parseISO(a.appointmentDate)))),
  ).length

  return {
    total: appointments.length,
    today: todayCount,
    upcoming: upcomingCount,
    completed: appointments.filter((a) => a.displayStatus === 'completed').length,
    cancelled: appointments.filter((a) => a.displayStatus === 'cancelled').length,
  }
}

export function formatAppointmentDate(dateString) {
  if (!dateString) return '—'
  return format(parseISO(dateString), 'EEE, d MMM yyyy')
}
