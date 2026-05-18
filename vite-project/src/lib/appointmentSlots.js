export const SLOT_INTERVAL_MINUTES = 30

const DEFAULT_WEEKDAY_WINDOWS = [
  ['08:30', '12:30'],
  ['14:00', '16:30'],
]

const SATURDAY_WINDOWS = [['09:00', '12:00']]

function toMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

function toTimeLabel(minutes) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

export function formatDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatReadableDate(date) {
  return new Intl.DateTimeFormat('en-ZA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date)
}

export function getAppointmentWindows(date) {
  const day = date.getDay()

  if (day === 0) {
    return []
  }

  return day === 6 ? SATURDAY_WINDOWS : DEFAULT_WEEKDAY_WINDOWS
}

export function getTimeSlots(date) {
  return getAppointmentWindows(date).flatMap(([start, end]) => {
    const slots = []
    const endMinutes = toMinutes(end)

    for (
      let cursor = toMinutes(start);
      cursor < endMinutes;
      cursor += SLOT_INTERVAL_MINUTES
    ) {
      slots.push(toTimeLabel(cursor))
    }

    return slots
  })
}

export function isPastDate(date) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const candidate = new Date(date)
  candidate.setHours(0, 0, 0, 0)

  return candidate < today
}
