import { isSupabaseConfigured, supabase } from '../lib/supabase'

function toEdgePayload(appointment) {
  return {
    full_name: appointment.fullName,
    email: appointment.email,
    phone: appointment.phone,
    appointment_date: appointment.appointmentDate,
    appointment_time: appointment.appointmentTime,
    service: appointment.service,
    notes: appointment.notes,
    admin_notes: appointment.adminNotes ?? '',
  }
}

async function invokeNotificationEdge(type, appointment, declineReason = '') {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('[Notifications] Supabase not configured')
    return { success: false, skipped: true }
  }

  const { data, error } = await supabase.functions.invoke(
    'send-appointment-notification',
    {
      body: {
        type,
        appointment: toEdgePayload(appointment),
        decline_reason: declineReason,
        admin_notes: appointment.adminNotes ?? declineReason,
      },
    },
  )

  if (error) {
    console.error('[Notifications] Edge function error', error)
    return { success: false, error }
  }

  if (data?.error) {
    console.error('[Notifications]', data.error)
    return { success: false, error: new Error(data.error) }
  }

  return { success: true, results: data?.results }
}

/** Sends email (Resend) + SMS (Twilio) via secure Edge Function. */
export async function sendApprovalNotification(appointment) {
  return invokeNotificationEdge('approved', appointment)
}

export async function sendDeclineNotification(appointment, declineReason = '') {
  return invokeNotificationEdge('declined', appointment, declineReason)
}
