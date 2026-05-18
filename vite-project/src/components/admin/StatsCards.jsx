import { motion } from 'motion/react'

const cardMotion = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
}

function StatsCards({ stats }) {
  const items = [
    { label: 'Total appointments', value: stats.total, hint: 'All time' },
    { label: "Today's schedule", value: stats.today, hint: 'Visits today' },
    { label: 'Upcoming', value: stats.upcoming, hint: 'Active bookings' },
    { label: 'Completed', value: stats.completed, hint: 'Finished visits' },
  ]

  return (
    <motion.div
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      initial="initial"
      animate="animate"
    >
      {items.map((item, index) => (
        <motion.article
          key={item.label}
          className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-900/5 transition hover:shadow-md hover:shadow-slate-900/8"
          transition={{ duration: 0.45, delay: index * 0.05 }}
          whileHover={{ y: -2 }}
          {...cardMotion}
        >
          <p className="text-sm font-medium text-slate-500">{item.label}</p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
            {item.value}
          </p>
          <p className="mt-2 text-xs text-slate-400">{item.hint}</p>
        </motion.article>
      ))}
    </motion.div>
  )
}

export default StatsCards
