import { useState } from 'react'
import { motion } from 'motion/react'
import { ROLES, getRoleLabel } from '../../lib/permissions'
import { useUsers } from '../../hooks/useUsers'

const ROLE_OPTIONS = [
  ROLES.ADMIN,
  ROLES.DOCTOR,
  ROLES.RECEPTIONIST,
  ROLES.SUPER_ADMIN,
]

function UsersPanel() {
  const { users, isLoading, error, isSubmitting, canManageUsers, createUser } =
    useUsers()

  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    role: ROLES.RECEPTIONIST,
  })
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')

  if (!canManageUsers) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm text-slate-600">
          You do not have permission to manage clinic users.
        </p>
      </div>
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')
    setFormSuccess('')

    const result = await createUser({
      email: form.email,
      password: form.password,
      fullName: form.fullName,
      role: form.role,
    })

    if (!result.success) {
      setFormError(result.error?.message ?? 'Could not create user.')
      return
    }

    setFormSuccess(`Created ${form.fullName} successfully.`)
    setForm({
      email: '',
      password: '',
      fullName: '',
      role: ROLES.RECEPTIONIST,
    })
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Clinic users
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Super admins can create staff accounts. User creation runs through a
          secure Supabase Edge Function — the service role key never touches the
          browser.
        </p>
      </section>

      <motion.div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <form
          className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm"
          onSubmit={handleSubmit}
        >
          <h3 className="text-lg font-semibold text-slate-950">Create user</h3>

          <div className="mt-5 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-semibold">Full name</span>
              <input
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                onChange={(e) => setForm((c) => ({ ...c, fullName: e.target.value }))}
                required
                value={form.fullName}
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold">Email</span>
              <input
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                onChange={(e) => setForm((c) => ({ ...c, email: e.target.value }))}
                required
                type="email"
                value={form.email}
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold">Temporary password</span>
              <input
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                minLength={8}
                onChange={(e) => setForm((c) => ({ ...c, password: e.target.value }))}
                required
                type="password"
                value={form.password}
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold">Role</span>
              <select
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                onChange={(e) => setForm((c) => ({ ...c, role: e.target.value }))}
                value={form.role}
              >
                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {getRoleLabel(role)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {formError && (
            <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {formError}
            </p>
          )}
          {formSuccess && (
            <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {formSuccess}
            </p>
          )}

          <button
            className="mt-5 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:opacity-50"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Creating...' : 'Create clinic user'}
          </button>
        </form>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-950">Team members</h3>

          {error && (
            <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {error}
            </p>
          )}

          {isLoading ? (
            <p className="mt-6 text-sm text-slate-500">Loading users...</p>
          ) : (
            <ul className="mt-5 divide-y divide-slate-100">
              {users.map((user) => (
                <li className="flex items-center justify-between gap-4 py-4" key={user.id}>
                  <div>
                    <p className="font-semibold text-slate-950">{user.full_name}</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                  <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                    {getRoleLabel(user.role)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default UsersPanel
