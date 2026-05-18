import { motion } from 'motion/react'
import primaryBrand from '../assets/branding1.jpeg'

const values = [
  ['Continuity', 'Long-term care plans that keep your medical history, goals, and family context in view.'],
  ['Clarity', 'Consultations explained in plain language, with practical next steps after every visit.'],
  ['Prevention', 'Screening, lifestyle guidance, and early intervention to support lasting health.'],
  ['Comfort', 'A polished, welcoming clinic experience with respectful and attentive service.'],
]

function About() {
  return (
    <section id="about" className="px-6 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <motion.div
          className="overflow-hidden rounded-[2rem] bg-slate-950 text-white"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="border-b border-white/10 bg-white p-6">
            <img
              alt="Dr. Lynette Classen General Practice logo"
              className="h-20 w-full object-contain"
              src={primaryBrand}
            />
          </div>
          <div className="p-8">
            <p className="text-sm font-semibold text-teal-200">
              About the practice
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight">
              Care that feels considered, calm, and complete.
            </h2>
            <p className="mt-5 leading-7 text-slate-300">
              The practice blends modern clinical standards with warm, relationship-led healthcare, helping patients make confident decisions about their wellbeing.
            </p>
          </div>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2">
          {values.map(([title, text], index) => (
            <motion.article
              className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-900/5"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.07 }}
              key={title}
            >
              <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About
