import { useCallback, useEffect, useState } from 'react'
import { PERMISSIONS } from '../lib/permissions'
import { createClinicUser, fetchClinicUsers } from '../services/users'
import { useAuth } from '../context/AuthContext'

export function useUsers(enabled = true) {
  const { hasPermission } = useAuth()
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canManageUsers = hasPermission(PERMISSIONS.MANAGE_USERS)

  const loadUsers = useCallback(async () => {
    if (!canManageUsers) {
      setUsers([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError('')

    const { data, error: fetchError } = await fetchClinicUsers()

    if (fetchError) {
      setError(fetchError.message)
      setUsers([])
    } else {
      setUsers(data)
    }

    setIsLoading(false)
  }, [canManageUsers])

  useEffect(() => {
    if (!enabled || !canManageUsers) {
      setIsLoading(false)
      return undefined
    }

    loadUsers()
  }, [enabled, canManageUsers, loadUsers])

  const createUser = useCallback(
    async (payload) => {
      if (!canManageUsers) {
        return { success: false, error: new Error('Permission denied') }
      }

      setIsSubmitting(true)
      setError('')

      const { data, error: createError } = await createClinicUser(payload)

      if (createError) {
        setError(createError.message)
        setIsSubmitting(false)
        return { success: false, error: createError }
      }

      setUsers((current) => [data, ...current])
      setIsSubmitting(false)
      return { success: true, data }
    },
    [canManageUsers],
  )

  return {
    users,
    isLoading,
    error,
    isSubmitting,
    canManageUsers,
    refresh: loadUsers,
    createUser,
  }
}
