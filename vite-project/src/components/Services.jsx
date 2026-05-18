import { motion } from 'motion/react'

const services = [
  {
    title: 'General Consultations',
    text: 'Thorough diagnosis, treatment plans, referrals, and everyday health concerns.',
  },
  {
    title: 'Preventive Health',
    text: 'Health screenings, wellness checks, risk assessments, and lifestyle guidance.',
  },
  {
    title: 'Chronic Care',
    text: 'Ongoing support for blood pressure, diabetes, asthma, thyroid care, and more.',
  },
  {
    title: 'Women and Family Health',
    text: 'Sensitive, practical care for women, children, parents, and older adults.',
  },
  {
    title: 'Minor Procedures',
    text: 'Clinic-based treatments, wound care, injections, and routine medical support.',
  },
  {
    title: 'Medical Certificates',
    text: 'Professional documentation, workplace medicals, and fitness assessments.',
  },
]

function Services() {
  return (
    <section id="services" className="bg-slate-50 px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            Services
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Medical care with room to listen.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.article
              className="group rounded-3xl border border-white bg-white p-7 shadow-sm shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              key={service.title}
            >
              <div className="mb-6 h-12 w-12 rounded-2xl bg-teal-50 ring-1 ring-teal-100 transition group-hover:bg-teal-700" />
              <h3 className="text-xl font-semibold text-slate-950">
                {service.title}
              </h3>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                {service.text}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
