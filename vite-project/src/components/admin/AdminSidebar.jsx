import { motion } from 'motion/react'
import { Link } from '../../lib/router'
import primaryBrand from '../../assets/drclassen_favicon.png'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: 'grid' },
  { label: 'Public site', href: '/', icon: 'home', external: false },
]

function NavIcon({ type }) {
  if (type === 'home') {
    return (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>
    )
  }

  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function AdminSidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          type="button"
        />
      )}

      <motion.aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200/80 bg-white px-5 py-6 shadow-xl shadow-slate-900/5 transition-transform lg:static lg:translate-x-0 lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        initial={false}
      >
        <div className="flex items-center gap-3 px-2">
          <span className="grid h-11 w-11 overflow-hidden rounded-2xl border border-slate-100 bg-white p-1 shadow-md">
            <img
              alt="Dr. Lynette Classen"
              className="h-full w-full object-contain"
              src={primaryBrand}
            />
          </span>
          <motion.div>
            <p className="text-sm font-semibold text-slate-950">Dr. Classen</p>
            <p className="text-xs text-slate-500">Admin dashboard</p>
          </motion.div>
        </div>

        <nav className="mt-10 grid gap-1">
          {navItems.map((item) => (
            <Link
              className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
              key={item.label}
              onClick={onClose}
              to={item.href}
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-50 text-slate-700">
                <NavIcon type={item.icon} />
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Practice
          </p>
          <p className="mt-2 text-sm font-medium text-slate-800">
            Family Medical Practice
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Manage appointments, statuses, and patient bookings in one place.
          </p>
        </div>
      </motion.aside>
    </>
  )
}

export default AdminSidebar
