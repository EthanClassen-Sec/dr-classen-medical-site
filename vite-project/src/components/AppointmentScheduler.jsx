import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import AppointmentForm from './scheduler/AppointmentForm'
import DateSelector from './scheduler/DateSelector'
import SchedulerNotice from './scheduler/SchedulerNotice'
import TimeSlotGrid from './scheduler/TimeSlotGrid'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import {
  formatDateKey,
  formatReadableDate,
  getTimeSlots,
  isPastDate,
} from '../lib/appointmentSlots'

const INITIAL_FORM_DATA = {
  patient_email: '',
  patient_name: '',
  patient_phone: '',
  reason: '',
}

function getSupabaseBookingErrorMessage(error) {
  const message = error?.message ?? ''

  if (error?.code === '23505') {
    return 'That slot was just booked by someone else. Please choose another available time.'
  }

  if (error?.code === '42501' || message.includes('row-level security')) {
    return 'Supabase rejected the booking because the insert policy is missing or too restrictive. Run the appointments SQL policies in Supabase.'
  }

  if (error?.code === '42P01' || message.includes('does not exist')) {
    return 'The appointments table does not exist yet. Run supabase/appointments.sql in your Supabase SQL editor.'
  }

  if (error?.code === '42703' || message.includes('column')) {
    return `The appointments table is missing a required column. Supabase says: ${message}`
  }

  return `We could not complete the booking. Supabase says: ${message || 'Unknown error.'}`
}

function getNextBookableDate() {
  const date = new Date()

  while (date.getDay() === 0) {
    date.setDate(date.getDate() + 1)
  }

  return date
}

function AppointmentScheduler() {
  const [selectedDate, setSelectedDate] = useState(getNextBookableDate)
  const [selectedSlot, setSelectedSlot] = useState('')
  const [bookedSlots, setBookedSlots] = useState([])
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notice, setNotice] = useState({
    message: isSupabaseConfigured
      ? ''
      : 'Connect Supabase environment variables to enable live bookings.',
    tone: 'info',
  })

  const dateKey = useMemo(() => formatDateKey(selectedDate), [selectedDate])
  const totalSlots = useMemo(() => getTimeSlots(selectedDate), [selectedDate])
  const availableSlots = useMemo(
    () => totalSlots.filter((slot) => !bookedSlots.includes(slot)),
    [bookedSlots, totalSlots],
  )

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return undefined
    }

    let isActive = true

    async function loadBookedSlots() {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('appointments')
        .select('appointment_time')
        .eq('appointment_date', dateKey)
        .eq('status', 'booked')

      if (!isActive) {
        return
      }

      if (error) {
        setNotice({
          message: 'We could not load live availability. Please try again shortly.',
          tone: 'error',
        })
        setBookedSlots([])
      } else {
        setBookedSlots(data.map((appointment) => appointment.appointment_time))
      }

      setIsLoading(false)
    }

    loadBookedSlots()

    const channel = supabase
      .channel(`appointments-${dateKey}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          filter: `appointment_date=eq.${dateKey}`,
          schema: 'public',
          table: 'appointments',
        },
        loadBookedSlots,
      )
      .subscribe()

    return () => {
      isActive = false
      supabase.removeChannel(channel)
    }
  }, [dateKey])

  function handleDateChange(date) {
    if (date) {
      setSelectedSlot('')
      setSelectedDate(date)
    }
  }

  function handleFormChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!isSupabaseConfigured) {
      setNotice({
        message: 'Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable booking.',
        tone: 'error',
      })
      return
    }

    if (!selectedSlot || !availableSlots.includes(selectedSlot)) {
      setNotice({
        message: 'That appointment time is no longer available. Please select another slot.',
        tone: 'error',
      })
      return
    }

    setIsSubmitting(true)
    setNotice({ message: '', tone: 'info' })

    const { error } = await supabase.from('appointments').insert({
      ...formData,
      appointment_date: dateKey,
      appointment_time: selectedSlot,
      status: 'booked',
    })

    if (error) {
      console.error('Supabase booking error', error)
      setNotice({
        message: getSupabaseBookingErrorMessage(error),
        tone: 'error',
      })
    } else {
      setBookedSlots((current) => [...new Set([...current, selectedSlot])])
      setFormData(INITIAL_FORM_DATA)
      setSelectedSlot('')
      setNotice({
        message: `Appointment requested for ${formatReadableDate(selectedDate)} at ${selectedSlot}.`,
        tone: 'success',
      })
    }

    setIsSubmitting(false)
  }

  return (
    <section id="booking" className="bg-slate-50 px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
              Appointments
            </p>
            <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Find a time that works for your visit.
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-slate-600">
              Choose a date, review live availability, and reserve a consultation
              time. Booked slots are removed automatically as availability changes.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {[
                ['Live availability', 'Supabase keeps the schedule updated as appointments are created.'],
                ['No double booking', 'A database uniqueness rule should protect each date and time slot.'],
              ].map(([title, text]) => (
                <div
                  className="rounded-3xl border border-white bg-white p-5 shadow-sm shadow-slate-900/5"
                  key={title}
                >
                  <h3 className="font-semibold text-slate-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="rounded-[2rem] border border-white bg-white p-5 shadow-2xl shadow-slate-900/8 sm:p-7"
            initial={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            viewport={{ once: true, amount: 0.2 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
              <div className="grid gap-6">
                <DateSelector
                  isDateAvailable={(date) =>
                    !isPastDate(date) && getTimeSlots(date).length > 0
                  }
                  onChange={handleDateChange}
                  selectedDate={selectedDate}
                />

                <div>
                  <div className="mb-3 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Available times
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatReadableDate(selectedDate)}
                      </p>
                    </div>
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
                      {availableSlots.length} open
                    </span>
                  </div>
                  <TimeSlotGrid
                    availableSlots={availableSlots}
                    isLoading={isLoading}
                    onSelectSlot={setSelectedSlot}
                    selectedSlot={selectedSlot}
                    totalSlots={totalSlots.length}
                  />
                </div>

                <SchedulerNotice message={notice.message} tone={notice.tone} />
              </div>

              <AppointmentForm
                formData={formData}
                isDisabled={!selectedSlot || !availableSlots.includes(selectedSlot)}
                isSubmitting={isSubmitting}
                onChange={handleFormChange}
                onSubmit={handleSubmit}
                selectedSlot={selectedSlot}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AppointmentScheduler
