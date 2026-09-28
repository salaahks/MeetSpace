export type UserRole = 'ADMIN' | 'MANAGER' | 'RH' | 'USER' | 'GUEST'

export interface User {
    id: number
    azureId?: string
    firstName: string
    lastName: string
    fullName?: string
    email: string
    phone?: string
    cin?: string
    address?: string
    role: UserRole
    temporaryPassword?: string
}
