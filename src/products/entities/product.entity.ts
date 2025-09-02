import { Category } from '../../categories/entities/category.entity'
import { Question } from '../../questions/entities/question.entity'
import { Review } from '../../reviews/entities/review.entity'
import { Store } from '../../stores/entities/store.entity'
import { CONDITIONS, CURRENCIES, SHIPPING } from '../../utils/constants.util'

export class Product {
  id: string
  title: string
  description: string
  longDescription?: string
  price: number
  currency: (typeof CURRENCIES)[number]
  category: string | Category
  store: string | Store
  reviews: number | (string | Review)[]
  rating?: number
  questions: (string | Question)[]
  images: string[]
  condition: (typeof CONDITIONS)[number]
  features?: string[]
  shipping: (typeof SHIPPING)[number]
  stock: number
  createdAt: Date
  updatedAt?: Date
}
