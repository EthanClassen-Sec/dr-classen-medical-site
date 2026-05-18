import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const CLINIC_ROLES = ['super_admin', 'admin', 'doctor', 'receptionist'] as const

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')

    if (!supabaseUrl || !serviceRoleKey || !anonKey) {
      return jsonResponse({ error: 'Missing Supabase environment configuration.' }, 500)
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

    const { data: callerProfile, error: profileError } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', caller.id)
      .single()

    if (profileError || callerProfile?.role !== 'super_admin') {
      return jsonResponse({ error: 'Only super admins can create users.' }, 403)
    }

    const body = await req.json()
    const email = String(body.email ?? '').trim().toLowerCase()
    const password = String(body.password ?? '')
    const fullName = String(body.full_name ?? '').trim()
    const role = String(body.role ?? '')

    if (!email || !password || !fullName || !CLINIC_ROLES.includes(role as typeof CLINIC_ROLES[number])) {
      return jsonResponse({ error: 'Invalid user payload.' }, 400)
    }

    if (password.length < 8) {
      return jsonResponse({ error: 'Password must be at least 8 characters.' }, 400)
    }

    const { data: createdUser, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    })

    if (createError || !createdUser.user) {
      return jsonResponse({ error: createError?.message ?? 'Could not create user.' }, 400)
    }

    const { error: insertProfileError } = await adminClient.from('profiles').insert({
      id: createdUser.user.id,
      email,
      full_name: fullName,
      role,
    })

    if (insertProfileError) {
      await adminClient.auth.admin.deleteUser(createdUser.user.id)
      return jsonResponse({ error: insertProfileError.message }, 400)
    }

    return jsonResponse({
      user: {
        id: createdUser.user.id,
        email,
        full_name: fullName,
        role,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error'
    return jsonResponse({ error: message }, 500)
  }
})

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
