function TimeSlotGrid({
  availableSlots,
  isLoading,
  onSelectSlot,
  selectedSlot,
  totalSlots,
}) {
  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            aria-hidden="true"
            className="h-12 animate-pulse rounded-2xl bg-slate-100"
            key={index}
          />
        ))}
      </div>
    )
  }

  if (!totalSlots) {
    return (
      <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-900">
        The practice is closed on this date. Please choose another day.
      </div>
    )
  }

  if (!availableSlots.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
        All slots are booked for this date. Pick another date or contact reception
        for urgent availability.
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {availableSlots.map((slot) => {
        const isSelected = selectedSlot === slot

        return (
          <button
            className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
              isSelected
                ? 'border-teal-700 bg-teal-700 text-white shadow-lg shadow-teal-900/15'
                : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800'
            }`}
            key={slot}
            onClick={() => onSelectSlot(slot)}
            type="button"
          >
            {slot}
          </button>
        )
      })}
    </div>
  )
}

export default TimeSlotGrid
