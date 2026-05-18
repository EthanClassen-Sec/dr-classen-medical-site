/**
 * Google Calendar integration placeholder.
 * Wire OAuth + Calendar API here when credentials are available.
 */

export function buildCalendarEventPayload(appointment) {
  return {
    summary: `Visit: ${appointment.fullName}`,
    description: [
      `Patient: ${appointment.fullName}`,
      `Email: ${appointment.email}`,
      `Phone: ${appointment.phone}`,
      `Service: ${appointment.service}`,
      `Notes: ${appointment.notes}`,
      appointment.adminNotes ? `Admin notes: ${appointment.adminNotes}` : null,
    ]
      .filter(Boolean)
      .join('\n'),
    start: {
      date: appointment.appointmentDate,
      time: appointment.appointmentTime,
    },
    end: {
      // Default 30-minute visits; align with SLOT_INTERVAL_MINUTES later.
      date: appointment.appointmentDate,
      time: appointment.appointmentTime,
    },
    attendees: [{ email: appointment.email }],
  }
}

/** Placeholder — logs intent until OAuth is configured. */
export async function createCalendarEventForAppointment(appointment) {
  const payload = buildCalendarEventPayload(appointment)

  console.info('[Google Calendar] Event placeholder created', payload)

  return {
    success: true,
    placeholder: true,
    eventId: null,
    payload,
  }
}
