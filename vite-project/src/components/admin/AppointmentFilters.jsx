import { motion } from 'motion/react'

const FILTERS = [
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'completed', label: 'Completed' },
  { id: 'declined', label: 'Declined' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'all', label: 'All' },
]

function AppointmentFilters({ activeFilter, onChange }) {
  return (
    <motion.div
      className="flex flex-wrap gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter.id

        return (
          <button
            key={filter.id}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/10'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
            onClick={() => onChange(filter.id)}
            type="button"
          >
            {filter.label}
          </button>
        )
      })}
    </motion.div>
  )
}

export default AppointmentFilters
