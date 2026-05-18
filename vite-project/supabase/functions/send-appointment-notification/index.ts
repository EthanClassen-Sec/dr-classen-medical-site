import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type NotificationType = 'approved' | 'declined'

type AppointmentPayload = {
  full_name: string
  email: string
  phone: string
  appointment_date: string
  appointment_time: string
  service?: string
  notes?: string
  admin_notes?: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')

    if (!supabaseUrl || !serviceRoleKey || !anonKey) {
      return jsonResponse({ error: 'Missing Supabase configuration.' }, 500)
    }

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return jsonResponse({ error: 'Unauthorized' }, 401)
    }

    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const adminClient = createClient(supabaseUrl, serviceRoleKey)

    const {
      data: { user: caller },
      error: callerError,
    } = await callerClient.auth.getUser()

    if (callerError || !caller) {
      return jsonResponse({ error: 'Unauthorized' }, 401)
    }

    const { data: profile } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', caller.id)
      .single()

    const staffRoles = ['super_admin', 'admin', 'doctor', 'receptionist']
    if (!profile?.role || !staffRoles.includes(profile.role)) {
      return jsonResponse({ error: 'Clinic staff access required.' }, 403)
    }

    const body = await req.json()
    const type = body.type as NotificationType
    const appointment = body.appointment as AppointmentPayload
    const declineReason = String(body.decline_reason ?? body.admin_notes ?? '').trim()

    if (!appointment?.email || !appointment?.phone || !appointment?.full_name) {
      return jsonResponse({ error: 'Invalid appointment payload.' }, 400)
    }

    if (type !== 'approved' && type !== 'declined') {
      return jsonResponse({ error: 'Invalid notification type.' }, 400)
    }

    const clinicName = Deno.env.get('CLINIC_NAME') ?? 'Dr. Lynette Classen'
    const { emailSubject, emailHtml, smsBody } = buildMessages(
      type,
      appointment,
      clinicName,
      declineReason,
    )

    const results = {
      email: { sent: false, skipped: false, error: null as string | null },
      sms: { sent: false, skipped: false, error: null as string | null },
    }

    const resendKey = Deno.env.get('RESEND_API_KEY')
    const fromEmail = Deno.env.get('RESEND_FROM_EMAIL')

    if (resendKey && fromEmail) {
      try {
        await sendResendEmail({
          apiKey: resendKey,
          from: fromEmail,
          to: appointment.email,
          subject: emailSubject,
          html: emailHtml,
        })
        results.email.sent = true
      } catch (error) {
        results.email.error = error instanceof Error ? error.message : 'Email failed'
      }
    } else {
      results.email.skipped = true
    }

    const twilioSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const twilioToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const twilioFrom = Deno.env.get('TWILIO_PHONE_NUMBER')

    if (twilioSid && twilioToken && twilioFrom) {
      try {
        const toPhone = normalizePhone(appointment.phone)
        await sendTwilioSms({
          accountSid: twilioSid,
          authToken: twilioToken,
          from: twilioFrom,
          to: toPhone,
          body: smsBody,
        })
        results.sms.sent = true
      } catch (error) {
        results.sms.error = error instanceof Error ? error.message : 'SMS failed'
      }
    } else {
      results.sms.skipped = true
    }

    return jsonResponse({ success: true, results })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error'
    return jsonResponse({ error: message }, 500)
  }
})

function buildMessages(
  type: NotificationType,
  appointment: AppointmentPayload,
  clinicName: string,
  declineReason: string,
) {
  const date = appointment.appointment_date
  const time = appointment.appointment_time
  const service = appointment.service ?? 'Consultation'
  const patientName = appointment.full_name

  if (type === 'approved') {
    return {
      emailSubject: `Appointment confirmed – ${clinicName}`,
      emailHtml: wrapEmail(
        `<p>Hi ${patientName},</p>
         <p>Your appointment request has been <strong>approved</strong>.</p>
         <ul>
           <li><strong>Date:</strong> ${date}</li>
           <li><strong>Time:</strong> ${time}</li>
           <li><strong>Service:</strong> ${service}</li>
         </ul>
         <p>We look forward to seeing you.</p>
         <p>— ${clinicName}</p>`,
      ),
      smsBody: `${clinicName}: Your appointment is confirmed for ${date} at ${time} (${service}).`,
    }
  }

  const reasonLine = declineReason ? ` Reason: ${declineReason}` : ''

  return {
    emailSubject: `Appointment update – ${clinicName}`,
    emailHtml: wrapEmail(
      `<p>Hi ${patientName},</p>
       <p>Unfortunately we could not confirm your requested appointment on ${date} at ${time}.${reasonLine}</p>
       <p>Please submit a new request on our website or contact the practice.</p>
       <p>— ${clinicName}</p>`,
    ),
    smsBody: `${clinicName}: We could not confirm your appointment on ${date} at ${time}.${reasonLine}`,
  }
}

function wrapEmail(innerHtml: string) {
  return `<div style="font-family: Inter, Arial, sans-serif; color: #0f172a; line-height: 1.6;">${innerHtml}</div>`
}

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, '')

  if (phone.startsWith('+')) {
    return `+${digits}`
  }

  if (digits.startsWith('27')) {
    return `+${digits}`
  }

  if (digits.startsWith('0')) {
    return `+27${digits.slice(1)}`
  }

  return `+27${digits}`
}

async function sendResendEmail({
  apiKey,
  from,
  to,
  subject,
  html,
}: {
  apiKey: string
  from: string
  to: string
  subject: string
  html: string
}) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Resend error: ${text}`)
  }
}

async function sendTwilioSms({
  accountSid,
  authToken,
  from,
  to,
  body,
}: {
  accountSid: string
  authToken: string
  from: string
  to: string
  body: string
}) {
  const credentials = btoa(`${accountSid}:${authToken}`)
  const params = new URLSearchParams({ To: to, From: from, Body: body })

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    },
  )

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Twilio error: ${text}`)
  }
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
