function AppointmentSearch({ value, onChange }) {
  return (
    <label className="block w-full max-w-md">
      <span className="sr-only">Search appointments</span>
      <input
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search patient, email, phone, service..."
        type="search"
        value={value}
      />
    </label>
  )
}

export default AppointmentSearch
