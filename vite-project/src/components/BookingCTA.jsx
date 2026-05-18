import { motion } from 'motion/react'

function BookingCTA() {
  return (
    <section id="booking" className="px-6 py-20 lg:px-8">
      <motion.div
        className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-700 to-blue-700 p-8 text-white shadow-2xl shadow-teal-900/20 sm:p-12 lg:p-16"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-teal-100">
              Appointments
            </p>
            <h2 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Ready for care that puts the conversation first?
            </h2>
            <p className="mt-5 max-w-2xl leading-7 text-blue-50">
              Contact the practice to request an appointment, ask about availability, or prepare for your first visit with Dr. Lynette Classen.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <a
              className="rounded-full bg-white px-7 py-4 text-center text-sm font-semibold text-teal-800 shadow-lg shadow-slate-900/10 transition hover:bg-teal-50"
              href="tel:+27000000000"
            >
              Call the Practice
            </a>
            <a
              className="rounded-full border border-white/30 px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-white/10"
              href="mailto:drclassenmedical@gmail.com"
            >
              Email Reception
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default BookingCTA
