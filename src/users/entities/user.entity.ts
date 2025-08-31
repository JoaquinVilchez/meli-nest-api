export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

export class User {
  id: string
  email: string
  passwordHash: string
  firstName: string
  lastName: string
  nickname: string
  avatar?: string
  isActive: boolean
  role: UserRole
  phone: string
  address: string
  emailVerifiedAt?: Date
  createdAt: Date
  updatedAt?: Date
}
