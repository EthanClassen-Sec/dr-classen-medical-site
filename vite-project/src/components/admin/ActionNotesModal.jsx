import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

function ActionNotesModal({
  isOpen,
  title,
  description,
  confirmLabel,
  confirmTone = 'primary',
  onClose,
  onConfirm,
  isSubmitting,
}) {
  const [notes, setNotes] = useState('')

  function handleClose() {
    setNotes('')
    onClose()
  }

  async function handleSubmit(event) {
    event.preventDefault()
    await onConfirm(notes.trim())
    setNotes('')
  }

  const confirmClasses =
    confirmTone === 'danger'
      ? 'bg-rose-600 hover:bg-rose-700'
      : 'bg-slate-950 hover:bg-teal-800'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/30 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md rounded-[2rem] border border-white bg-white p-6 shadow-2xl shadow-slate-900/15 sm:p-8"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
          >
            <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>

            <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-900">
                  Notes (optional)
                </span>
                <textarea
                  className="min-h-24 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Internal note or patient-facing reason"
                  value={notes}
                />
              </label>

              <motion.div className="flex flex-wrap justify-end gap-2">
                <button
                  className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  onClick={handleClose}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className={`rounded-full px-5 py-2 text-sm font-semibold text-white transition disabled:opacity-50 ${confirmClasses}`}
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? 'Saving...' : confirmLabel}
                </button>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ActionNotesModal
