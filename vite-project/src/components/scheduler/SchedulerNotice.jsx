function SchedulerNotice({ message, tone = 'info' }) {
  if (!message) {
    return null
  }

  const styles = {
    error: 'border-rose-100 bg-rose-50 text-rose-800',
    info: 'border-blue-100 bg-blue-50 text-blue-800',
    success: 'border-teal-100 bg-teal-50 text-teal-800',
  }

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${styles[tone]}`}>
      {message}
    </div>
  )
}

export default SchedulerNotice
