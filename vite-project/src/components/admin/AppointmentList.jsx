import AppointmentCard from './AppointmentCard'
import AppointmentTable from './AppointmentTable'
import EmptyState from './EmptyState'
import LoadingState from './LoadingState'

function AppointmentList({
  appointments,
  isLoading,
  activeFilter,
  actionId,
  onComplete,
  onCancel,
  onDelete,
}) {
  if (isLoading) {
    return <LoadingState />
  }

  if (appointments.length === 0) {
    return <EmptyState filter={activeFilter} />
  }

  return (
    <>
      <div className="grid gap-4 lg:hidden">
        {appointments.map((appointment, index) => (
          <AppointmentCard
            actionId={actionId}
            appointment={appointment}
            index={index}
            key={appointment.id}
            onCancel={onCancel}
            onComplete={onComplete}
            onDelete={onDelete}
          />
        ))}
      </div>

      <AppointmentTable
        actionId={actionId}
        appointments={appointments}
        onCancel={onCancel}
        onComplete={onComplete}
        onDelete={onDelete}
      />
    </>
  )
}

export default AppointmentList
