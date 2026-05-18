import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

function DateSelector({ selectedDate, onChange, isDateAvailable }) {
  return (
    <div>
      <label
        className="text-sm font-semibold text-slate-900"
        htmlFor="appointment-date"
      >
        Select appointment date
      </label>
      <DatePicker
        calendarClassName="medical-datepicker"
        dateFormat="EEEE, d MMMM yyyy"
        filterDate={isDateAvailable}
        id="appointment-date"
        minDate={new Date()}
        onChange={onChange}
        selected={selectedDate}
        wrapperClassName="mt-3 w-full"
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm shadow-slate-900/5 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
      />
    </div>
  )
}

export default DateSelector
