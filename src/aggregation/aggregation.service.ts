import * as path from 'path'

import { Injectable } from '@nestjs/common'

import { Review } from '../reviews/entities/review.entity'
import { FilePersistenceUtil } from '../utils/file-persistence.util'

@Injectable()
export class AggregationService {
  private readonly reviewsFileData = path.join(process.cwd(), 'src', 'data', 'reviews.json')

  async calculateProductRating(productId: string): Promise<number> {
    try {
      const reviews = await FilePersistenceUtil.readData<Review[]>(this.reviewsFileData)

      const productReviews = reviews.filter(review => review.product === productId)

      if (productReviews.length === 0) {
        return 0
      }

      const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0)
      const averageRating = totalRating / productReviews.length

      return Math.round(averageRating * 10) / 10
    } catch (error) {
      console.error('Error calculating product rating:', error)
      return 0
    }
  }

  async countProductReviews(productId: string): Promise<number> {
    try {
      const reviews = await FilePersistenceUtil.readData<Review[]>(this.reviewsFileData)
      const productReviews = reviews.filter(review => review.product === productId)
      return productReviews.length
    } catch (error) {
      console.error('Error counting product reviews:', error)
      return 0
    }
  }
}
