import { motion } from 'motion/react'

function EmptyState({ filter }) {
  const messages = {
    today: 'No appointments scheduled for today.',
    upcoming: 'No upcoming appointments. New bookings will appear here.',
    all: 'No appointments yet. Patient bookings will show up in this dashboard.',
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white px-8 py-16 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-slate-50 text-slate-400">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-950">Nothing scheduled</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {messages[filter] ?? messages.all}
      </p>
    </motion.div>
  )
}

export default EmptyState
