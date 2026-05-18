import { motion } from 'motion/react'

function StatsCards({ stats }) {
  const items = [
    { label: 'Pending review', value: stats.pending, hint: 'Awaiting approval' },
    { label: 'Approved', value: stats.approved, hint: 'Confirmed visits' },
    { label: "Today's schedule", value: stats.today, hint: 'All statuses today' },
    { label: 'Completed', value: stats.completed, hint: 'Finished visits' },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <motion.article
          key={item.label}
          className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-900/5 transition hover:shadow-md hover:shadow-slate-900/8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: index * 0.05 }}
          whileHover={{ y: -2 }}
        >
          <p className="text-sm font-medium text-slate-500">{item.label}</p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
            {item.value}
          </p>
          <p className="mt-2 text-xs text-slate-400">{item.hint}</p>
        </motion.article>
      ))}
    </div>
  )
}

export default StatsCards
