import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  deleteAppointment,
  fetchAllAppointments,
  updateAppointmentStatus,
} from '../lib/appointments'
import {
  filterAppointments,
  normalizeAppointment,
  sortAppointmentsByDate,
} from '../utils/appointmentUtils'

export function useAppointments(activeFilter = 'upcoming', enabled = true) {
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionId, setActionId] = useState(null)

  const loadAppointments = useCallback(async () => {
    setIsLoading(true)
    setError('')

    const { data, error: fetchError } = await fetchAllAppointments()

    if (fetchError) {
      setError(fetchError.message)
      setAppointments([])
    } else {
      setAppointments(data.map(normalizeAppointment))
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false)
      return undefined
    }

    loadAppointments()
  }, [loadAppointments, enabled])

  const sorted = useMemo(
    () => sortAppointmentsByDate(appointments),
    [appointments],
  )

  const filtered = useMemo(
    () => filterAppointments(sorted, activeFilter),
    [sorted, activeFilter],
  )

  const runAction = useCallback(async (id, action) => {
    setActionId(id)
    setError('')

    let result

    if (action === 'delete') {
      result = await deleteAppointment(id)
    } else if (action === 'complete') {
      result = await updateAppointmentStatus(id, 'completed')
    } else if (action === 'cancel') {
      result = await updateAppointmentStatus(id, 'cancelled')
    }

    if (result?.error) {
      setError(result.error.message)
    } else {
      if (action === 'delete') {
        setAppointments((current) => current.filter((a) => a.id !== id))
      } else {
        const nextStatus = action === 'complete' ? 'completed' : 'cancelled'
        setAppointments((current) =>
          current.map((a) =>
            a.id === id
              ? {
                  ...a,
                  status: nextStatus,
                  displayStatus: nextStatus,
                }
              : a,
          ),
        )
      }
    }

    setActionId(null)
  }, [])

  return {
    appointments: filtered,
    allAppointments: sorted,
    isLoading,
    error,
    actionId,
    refresh: loadAppointments,
    deleteAppointment: (id) => runAction(id, 'delete'),
    completeAppointment: (id) => runAction(id, 'complete'),
    cancelAppointment: (id) => runAction(id, 'cancel'),
  }
}
