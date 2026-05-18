const fields = [
  {
    autoComplete: 'name',
    label: 'Full name',
    name: 'patient_name',
    placeholder: 'Your full name',
    type: 'text',
  },
  {
    autoComplete: 'tel',
    label: 'Phone number',
    name: 'patient_phone',
    placeholder: '+27 ...',
    type: 'tel',
  },
  {
    autoComplete: 'email',
    label: 'Email address',
    name: 'patient_email',
    placeholder: 'you@example.com',
    type: 'email',
  },
]

function AppointmentForm({
  formData,
  isDisabled,
  isSubmitting,
  onChange,
  onSubmit,
  selectedSlot,
}) {
  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      {fields.map((field) => (
        <label className="grid gap-2" key={field.name}>
          <span className="text-sm font-semibold text-slate-900">
            {field.label}
          </span>
          <input
            autoComplete={field.autoComplete}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            name={field.name}
            onChange={onChange}
            placeholder={field.placeholder}
            required
            type={field.type}
            value={formData[field.name]}
          />
        </label>
      ))}

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-900">
          Reason for visit
        </span>
        <textarea
          className="min-h-28 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          name="reason"
          onChange={onChange}
          placeholder="Briefly tell us what you need help with"
          required
          value={formData.reason}
        />
      </label>

      <button
        className="mt-2 rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-slate-950/10 transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        disabled={isDisabled || isSubmitting}
        type="submit"
      >
        {isSubmitting
          ? 'Booking appointment...'
          : selectedSlot
            ? `Book ${selectedSlot}`
            : 'Choose a time first'}
      </button>
    </form>
  )
}

export default AppointmentForm
