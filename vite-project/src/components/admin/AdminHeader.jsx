import { motion } from 'motion/react'

function AdminHeader({ onMenuToggle, onRefresh, onSignOut, userEmail }) {
  return (
    <motion.header
      className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            aria-label="Open menu"
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-700 lg:hidden"
            onClick={onMenuToggle}
            type="button"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                strokeLinecap="round"
                strokeWidth="1.5"
              />
            </svg>
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Dashboard
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
              Appointments
            </h1>
          </div>
        </div>

        <motion.div className="flex items-center gap-2 sm:gap-3">
          <button
            className="hidden rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 sm:inline-flex"
            onClick={onRefresh}
            type="button"
          >
            Refresh
          </button>
          <div className="hidden text-right sm:block">
            <p className="text-xs text-slate-400">Signed in</p>
            <p className="max-w-[12rem] truncate text-sm font-medium text-slate-800">
              {userEmail}
            </p>
          </div>
          <button
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800"
            onClick={onSignOut}
            type="button"
          >
            Sign out
          </button>
        </motion.div>
      </div>
    </motion.header>
  )
}

export default AdminHeader
