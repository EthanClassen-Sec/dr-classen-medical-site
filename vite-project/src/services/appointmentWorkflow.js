import {
  approveAppointment as approveRow,
  cancelAppointment as cancelRow,
  completeAppointment as completeRow,
  declineAppointment as declineRow,
  deleteAppointment as deleteRow,
} from '../lib/appointments'
import { normalizeAppointment } from '../utils/appointmentUtils'
import { createCalendarEventForAppointment } from './googleCalendar'
import { sendApprovalNotification, sendDeclineNotification } from './notifications'

/** Runs post-approval side effects (calendar + notifications). */
async function handleApproved(appointment, adminNotes) {
  const normalized = {
    ...appointment,
    adminNotes: adminNotes ?? appointment.adminNotes,
  }

  await Promise.all([
    createCalendarEventForAppointment(normalized),
    sendApprovalNotification(normalized),
  ])
}

/** Runs post-decline side effects. */
async function handleDeclined(appointment, declineReason) {
  await sendDeclineNotification(appointment, declineReason)
}

export async function approveAppointmentRequest(id, adminNotes = '') {
  const { data, error } = await approveRow(id, adminNotes)

  if (!error && data) {
    const appointment = normalizeAppointment(data)
    await handleApproved(appointment, adminNotes)
    return { data: appointment, error: null }
  }

  return { data: null, error }
}

export async function declineAppointmentRequest(id, adminNotes = '') {
  const { data, error } = await declineRow(id, adminNotes)

  if (!error && data) {
    const appointment = normalizeAppointment(data)
    await handleDeclined(appointment, adminNotes)
    return { data: appointment, error: null }
  }

  return { data: null, error }
}

export async function cancelAppointmentRequest(id, adminNotes = '') {
  const { data, error } = await cancelRow(id, adminNotes)
  return {
    data: data ? normalizeAppointment(data) : null,
    error,
  }
}

export async function completeAppointmentRequest(id, adminNotes = '') {
  const { data, error } = await completeRow(id, adminNotes)
  return {
    data: data ? normalizeAppointment(data) : null,
    error,
  }
}

export async function deleteAppointmentRequest(id) {
  const { error } = await deleteRow(id)
  return { error }
}
