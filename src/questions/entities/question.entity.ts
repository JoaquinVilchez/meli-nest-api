import { Product } from '../../products/entities/product.entity'
import { User } from '../../users/entities/user.entity'

export class Question {
  id: string
  product: Product | string
  user: User | string
  content: string
  answers?: Answer[]
  isAnswered: boolean
  createdAt: Date
  updatedAt?: Date
}

export class Answer {
  id: string
  question: Question | string
  user: User | string
  content: string
  createdAt: Date
  updatedAt?: Date
}
