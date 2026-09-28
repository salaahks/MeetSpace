export const defaultPageSize = 10

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

// Azure AD domain appended to new users' usernames, e.g. "contoso.onmicrosoft.com"
export const TENANT_DOMAIN = process.env.NEXT_PUBLIC_TENANT_DOMAIN || 'example.onmicrosoft.com'

// Optional helpdesk URL; equipment issues fall back to e-mail when it is not set
export const SUPPORT_TICKET_URL = process.env.NEXT_PUBLIC_SUPPORT_TICKET_URL || ''

// Floor plan behind the interactive room map; room pins are positioned in % of it
export const FLOOR_PLAN_URL = process.env.NEXT_PUBLIC_FLOOR_PLAN_URL || '/images/floor-plan.svg'

export const APP_NAME = 'MeetSpace'
export const APP_VERSION = '1.0.0'

export const PUBLIC_PATHS = ['/login', '/api/auth']

export const Mode = {
  VIEW: 'VIEW',
  EDIT: 'EDIT',
  ADD: 'ADD',
}

export const ReservationStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
}

export const RoomType = {
  SINGLE: 'SINGLE',
  DOUBLE: 'DOUBLE',
  SUITE: 'SUITE',
}