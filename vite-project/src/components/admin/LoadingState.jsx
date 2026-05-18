import { motion } from 'motion/react'

function LoadingState() {
  return (
    <motion.div className="grid gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          className="animate-pulse rounded-3xl border border-slate-100 bg-white p-6"
          key={index}
          transition={{ duration: 1.4, repeat: Infinity }}
        >
          <div className="h-4 w-32 rounded-full bg-slate-100" />
          <div className="mt-4 h-3 w-2/3 rounded-full bg-slate-100" />
          <div className="mt-6 grid gap-2 sm:grid-cols-3">
            <div className="h-3 rounded-full bg-slate-50" />
            <div className="h-3 rounded-full bg-slate-50" />
            <div className="h-3 rounded-full bg-slate-50" />
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default LoadingState
