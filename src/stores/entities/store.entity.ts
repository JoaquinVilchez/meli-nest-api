import { Category } from '../../categories/entities/category.entity'

export class Store {
  id: string
  storeCode: string
  isActive: boolean
  name: string
  slug: string
  description?: string
  categories: (string | Category)[]
  logo?: string
  banner?: string
  isVerified: boolean
  verifiedAt?: Date
  createdAt: Date
  updatedAt?: Date
}
