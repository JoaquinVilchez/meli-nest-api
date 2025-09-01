import { Product } from '../../products/entities/product.entity'
import { User } from '../../users/entities/user.entity'

export class Review {
  id: string
  user: string | User
  product: string | Product
  rating: number
  comment: string
  createdAt: Date
  updatedAt?: Date
}
