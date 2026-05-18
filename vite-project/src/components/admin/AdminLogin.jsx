import { useState } from 'react'
import { motion } from 'motion/react'
import { Link } from '../../lib/router'
import primaryBrand from '../../assets/drclassen_favicon.png'

function AdminLogin({ authError, isLoading, isSupabaseConfigured, onSignIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    await onSignIn(email, password)
    setIsSubmitting(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16">
      <motion.div
        className="w-full max-w-md rounded-[2rem] border border-white bg-white p-8 shadow-2xl shadow-slate-900/8 sm:p-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 overflow-hidden rounded-2xl border border-slate-100 bg-white p-1 shadow-lg shadow-slate-900/8">
            <img
              alt="Dr. Lynette Classen"
              className="h-full w-full object-contain"
              src={primaryBrand}
            />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-950">Admin access</p>
            <p className="text-xs text-slate-500">Dr. Lynette Classen</p>
          </div>
        </div>

        <h1 className="mt-8 text-3xl font-semibold tracking-tight text-slate-950">
          Sign in to the clinic dashboard
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Secure access for practice staff. Use the admin account created in
          Supabase Authentication.
        </p>

        {!isSupabaseConfigured && (
          <p className="mt-6 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Add <code className="text-xs">VITE_SUPABASE_URL</code> and{' '}
            <code className="text-xs">VITE_SUPABASE_ANON_KEY</code> to your{' '}
            <code className="text-xs">.env</code> file, then restart the dev server.
          </p>
        )}

        <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-900">Email</span>
            <input
              autoComplete="email"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              value={email}
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-900">Password</span>
            <input
              autoComplete="current-password"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          {authError && (
            <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {authError}
            </p>
          )}

          <button
            className="mt-2 rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-slate-950/10 transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={!isSupabaseConfigured || isSubmitting || isLoading}
            type="submit"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <Link
          className="mt-6 block text-center text-sm font-medium text-slate-500 transition hover:text-slate-950"
          to="/"
        >
          ← Back to website
        </Link>
      </motion.div>
    </div>
  )
}

export default AdminLogin
