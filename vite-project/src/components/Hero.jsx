import { motion } from 'motion/react'
import doctorPortrait from '../assets/doctor-image.jpeg'
import brandMark from '../assets/branding2.jpeg'

function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden px-6 pb-20 pt-32 lg:px-8 lg:pb-28 lg:pt-36"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_14%,rgba(15,118,110,0.11),transparent_30%),radial-gradient(circle_at_82%_24%,rgba(59,130,246,0.1),transparent_28%),linear-gradient(135deg,#fbfdff_0%,#eef8f6_52%,#ffffff_100%)]" />
      <motion.div
        aria-hidden="true"
        className="absolute right-[6%] top-28 -z-10 hidden h-48 w-48 rounded-full border border-teal-100/70 lg:block"
        animate={{ y: [0, 14, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white/85 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-900/5 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-teal-600" />
            General practice in attentive, patient-first care
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-tight text-slate-950 sm:text-6xl lg:text-[4.65rem]">
            Professional family healthcare, led with clarity and care.
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
          <div className="mt-10 grid max-w-xl gap-3 text-sm text-slate-600 sm:grid-cols-3">
            {['General practice', 'Preventive health', 'Family care'].map((item) => (
              <div
                className="rounded-2xl border border-slate-100 bg-white/75 px-4 py-3 shadow-sm shadow-slate-900/5"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="relative mx-auto w-full max-w-xl lg:max-w-none"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.1, ease: 'easeOut' }}
        >
          <motion.div
            className="absolute -left-3 top-8 z-20 hidden rounded-3xl border border-white bg-white/90 p-4 shadow-xl shadow-slate-900/10 backdrop-blur sm:block"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <img
              alt="Dr. Lynette Classen brand signature"
              className="h-12 w-36 object-contain"
              src={brandMark}
            />
          </motion.div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white p-3 shadow-2xl shadow-slate-900/14">
            <div className="absolute inset-x-3 top-3 h-24 rounded-t-[1.5rem] bg-gradient-to-r from-teal-700 via-slate-900 to-blue-800" />
            <div className="relative overflow-hidden rounded-[1.5rem] bg-slate-100">
              <img
                alt="Portrait of Dr. Lynette Classen"
                className="h-[30rem] w-full object-cover object-[50%_18%] sm:h-[38rem] lg:h-[40rem]"
                src={doctorPortrait}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/22 to-transparent p-6 pt-28 text-white">
                <p className="text-sm font-semibold text-teal-100">Dr. Lynette Classen</p>
                <p className="mt-2 max-w-sm text-2xl font-semibold tracking-tight">
                  Continuity-focused general practice for everyday health.
                </p>
              </div>
            </div>
          </div>

          <motion.div
            className="absolute -bottom-8 right-4 z-20 rounded-3xl bg-teal-700 p-5 text-white shadow-xl shadow-teal-900/20 sm:right-8"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.45, ease: 'easeOut' }}
          >
            <p className="text-3xl font-semibold">360</p>
            <p className="mt-1 text-sm text-teal-50">Whole-person approach</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
