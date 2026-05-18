import { motion } from 'motion/react'

function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden px-6 pb-20 pt-32 lg:px-8 lg:pb-28 lg:pt-40"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.18),transparent_34%),linear-gradient(135deg,#f8fbff_0%,#eef9f7_48%,#ffffff_100%)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <p className="mb-5 inline-flex rounded-full border border-teal-100 bg-white/80 px-4 py-2 text-sm font-semibold text-teal-800 shadow-sm">
            Compassionate care for every stage of life
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Premium family healthcare with a personal touch.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Dr. Lynette Classen provides attentive, evidence-informed medical care in a calm clinic environment designed around trust, clarity, and continuity.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              className="rounded-full bg-teal-700 px-7 py-4 text-center text-sm font-semibold text-white shadow-xl shadow-teal-900/15 transition hover:bg-teal-800"
              href="#booking"
            >
              Schedule Appointment
            </a>
            <a
              className="rounded-full border border-slate-200 bg-white px-7 py-4 text-center text-sm font-semibold text-slate-800 transition hover:border-teal-200 hover:text-teal-800"
              href="#services"
            >
              View Services
            </a>
          </div>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.1, ease: 'easeOut' }}
        >
          <div className="rounded-[2rem] border border-white bg-white/80 p-4 shadow-2xl shadow-slate-900/10">
            <div className="overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-teal-50 via-white to-blue-50 p-8">
              <div className="grid gap-4">
                <div className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-900/5">
                  <p className="text-sm font-semibold text-teal-700">
                    Today at the clinic
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">
                    Patient-first consultations
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Preventive care, chronic support, wellness checks, and same-week appointment guidance.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-3xl bg-teal-700 p-5 text-white">
                    <p className="text-3xl font-semibold">20+</p>
                    <p className="mt-2 text-sm text-teal-50">
                      Years of trusted care
                    </p>
                  </div>
                  <div className="rounded-3xl bg-blue-100 p-5 text-slate-900">
                    <p className="text-3xl font-semibold">360</p>
                    <p className="mt-2 text-sm text-slate-600">
                      Whole-person approach
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
