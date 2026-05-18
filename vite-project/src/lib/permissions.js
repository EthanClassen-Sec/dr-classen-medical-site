/** Clinic roles stored on public.profiles.role */
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  RECEPTIONIST: 'receptionist',
}

export const PERMISSIONS = {
  MANAGE_USERS: 'manage_users',
  VIEW_APPOINTMENTS: 'view_appointments',
  MANAGE_APPOINTMENTS: 'manage_appointments',
  APPROVE_APPOINTMENTS: 'approve_appointments',
  DELETE_APPOINTMENTS: 'delete_appointments',
}

const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_APPOINTMENTS,
    PERMISSIONS.MANAGE_APPOINTMENTS,
    PERMISSIONS.APPROVE_APPOINTMENTS,
    PERMISSIONS.DELETE_APPOINTMENTS,
  ],
  [ROLES.DOCTOR]: [PERMISSIONS.VIEW_APPOINTMENTS],
  [ROLES.RECEPTIONIST]: [
    PERMISSIONS.VIEW_APPOINTMENTS,
    PERMISSIONS.MANAGE_APPOINTMENTS,
  ],
}

/** Returns true when the role may perform the permission. */
export function can(role, permission) {
  if (!role) {
    return false
  }

  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function isClinicStaff(role) {
  return Boolean(role && ROLE_PERMISSIONS[role])
}

export function getRoleLabel(role) {
  const labels = {
    [ROLES.SUPER_ADMIN]: 'Super Admin',
    [ROLES.ADMIN]: 'Admin',
    [ROLES.DOCTOR]: 'Doctor',
    [ROLES.RECEPTIONIST]: 'Receptionist',
  }

  return labels[role] ?? 'Unknown'
}
