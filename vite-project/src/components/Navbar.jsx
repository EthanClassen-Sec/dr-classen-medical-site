import { motion } from 'motion/react'

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Book', href: '#booking' },
]

function Navbar() {
  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 border-b border-white/70 bg-white/85 backdrop-blur-xl"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <a href="#top" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-700 text-sm font-semibold text-white shadow-lg shadow-teal-900/10">
            LC
          </span>
          <span>
            <span className="block text-sm font-semibold tracking-wide text-slate-950">
              Dr. Lynette Classen
            </span>
            <span className="block text-xs font-medium text-slate-500">
              Family Medical Practice
            </span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
              href={item.href}
              key={item.label}
            >
              {item.label}
            </a>
          ))}
        </div>

        <a
          href="#booking"
          className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-teal-800"
        >
          Book a Visit
        </a>
      </nav>
    </motion.header>
  )
}

export default Navbar
