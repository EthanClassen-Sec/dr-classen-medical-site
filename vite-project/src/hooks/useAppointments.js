import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchAllAppointments } from '../lib/appointments'
import { PERMISSIONS } from '../lib/permissions'
import {
  approveAppointmentRequest,
  cancelAppointmentRequest,
  completeAppointmentRequest,
  declineAppointmentRequest,
  deleteAppointmentRequest,
} from '../services/appointmentWorkflow'
import { useAuth } from '../context/AuthContext'
import {
  filterAppointments,
  normalizeAppointment,
  searchAppointments,
  sortAppointmentsByDate,
} from '../utils/appointmentUtils'

export function useAppointments({
  activeFilter = 'pending',
  searchQuery = '',
  enabled = true,
} = {}) {
  const { hasPermission } = useAuth()
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

  const filtered = useMemo(() => {
    const byStatus = filterAppointments(sorted, activeFilter)
    return searchAppointments(byStatus, searchQuery)
  }, [sorted, activeFilter, searchQuery])

  const updateLocalAppointment = useCallback((nextAppointment) => {
    setAppointments((current) =>
      current.map((item) =>
        item.id === nextAppointment.id ? nextAppointment : item,
      ),
    )
  }, [])

  const runWorkflow = useCallback(
    async (id, action, adminNotes = '') => {
      if (!hasPermission(PERMISSIONS.MANAGE_APPOINTMENTS)) {
        setError('You do not have permission to manage appointments.')
        return
      }

      setActionId(id)
      setError('')

      let result

      if (action === 'approve') {
        if (!hasPermission(PERMISSIONS.APPROVE_APPOINTMENTS)) {
          setError('You do not have permission to approve appointments.')
          setActionId(null)
          return
        }

        result = await approveAppointmentRequest(id, adminNotes)
      } else if (action === 'decline') {
        if (!hasPermission(PERMISSIONS.APPROVE_APPOINTMENTS)) {
          setError('You do not have permission to decline appointments.')
          setActionId(null)
          return
        }

        result = await declineAppointmentRequest(id, adminNotes)
      } else if (action === 'cancel') {
        result = await cancelAppointmentRequest(id, adminNotes)
      } else if (action === 'complete') {
        result = await completeAppointmentRequest(id, adminNotes)
      } else if (action === 'delete') {
        if (!hasPermission(PERMISSIONS.DELETE_APPOINTMENTS)) {
          setError('You do not have permission to delete appointments.')
          setActionId(null)
          return
        }

        result = await deleteAppointmentRequest(id)
      }

      if (result?.error) {
        setError(result.error.message)
      } else if (action === 'delete') {
        setAppointments((current) => current.filter((item) => item.id !== id))
      } else if (result?.data) {
        updateLocalAppointment(result.data)
      }

      setActionId(null)
    },
    [hasPermission, updateLocalAppointment],
  )

  return {
    appointments: filtered,
    allAppointments: sorted,
    isLoading,
    error,
    actionId,
    refresh: loadAppointments,
    approveAppointment: (id, notes) => runWorkflow(id, 'approve', notes),
    declineAppointment: (id, notes) => runWorkflow(id, 'decline', notes),
    cancelAppointment: (id, notes) => runWorkflow(id, 'cancel', notes),
    completeAppointment: (id, notes) => runWorkflow(id, 'complete', notes),
    deleteAppointment: (id) => runWorkflow(id, 'delete'),
  }
}
