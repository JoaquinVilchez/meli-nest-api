import { Store } from '../../stores/entities/store.entity'
import { User } from '../../users/entities/user.entity'

export class Review {
  id: string
  user: string | User
  store: string | Store
  rating: number
  comment: string
  createdAt: Date
  updatedAt?: Date
}
