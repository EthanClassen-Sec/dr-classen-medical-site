import About from '../components/About'
import AppointmentScheduler from '../components/AppointmentScheduler'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import Services from '../components/Services'

function HomePage() {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-950">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <AppointmentScheduler />
      <Footer />
    </main>
  )
}

export default HomePage
