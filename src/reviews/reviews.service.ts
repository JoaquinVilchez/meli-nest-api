import * as path from 'path'

import { Injectable, NotFoundException } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'

import { Product } from '../products/entities/product.entity'
import { ProductsService } from '../products/products.service'
import { User } from '../users/entities/user.entity'
import { UsersService } from '../users/users.service'
import { ENTITY_NAMES, REVIEWS_POPULATE_OPTIONS } from '../utils/constants.util'
import { EntityValidationUtil } from '../utils/entity-validation.util'
import { FilePersistenceUtil } from '../utils/file-persistence.util'

import { CreateReviewDto } from './dto/create-review.dto'
import { UpdateReviewDto } from './dto/update-review.dto'
import { Review } from './entities/review.entity'

@Injectable()
export class ReviewsService {
  private readonly reviewsFileData = path.join(process.cwd(), 'src', 'data', 'reviews.json')
  private reviewsData: Review[] = []

  private async loadData(): Promise<void> {
    try {
      this.reviewsData = await FilePersistenceUtil.readData<Review[]>(this.reviewsFileData)
    } catch (error) {
      console.error('Error loading reviews data:', error)
      this.reviewsData = []
    }
  }

  constructor(
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
  ) {
    this.loadData().catch(error => console.error('Failed to load data:', error))
  }

  async create(data: CreateReviewDto) {
    try {
      EntityValidationUtil.validateEntityExists(data.user, this.usersService, 'User')
      EntityValidationUtil.validateEntityExists(data.product, this.productsService, 'Product')

      const newReview = {
        id: uuidv4(),
        ...data,
        createdAt: new Date(),
      }

      this.reviewsData.push(newReview)
      await FilePersistenceUtil.persistData(this.reviewsFileData, this.reviewsData)

      return {
        data: newReview,
        message: 'Review created successfully',
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      console.error('Error creating review:', error)
      throw new Error('Failed to create review. Please try again later.')
    }
  }

  findAll(
    limit?: number,
    page?: number,
    populate: (typeof REVIEWS_POPULATE_OPTIONS)[number][] = [],
    pagination: boolean = true,
  ) {
    let reviewsResult: Review[]

    if (!pagination) {
      reviewsResult = this.reviewsData
      page = null
      limit = null
    } else {
      if (!page) {
        page = 1
      }
      if (!limit) {
        limit = 50
      }
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      reviewsResult = this.reviewsData.slice(startIndex, endIndex)
    }

    const total = reviewsResult.length

    if (populate && populate.includes(ENTITY_NAMES.USERS)) {
      reviewsResult = reviewsResult.map(review => ({
        ...review,
        user: this.usersService.findOne(review.user as User['id']).data,
      }))
    }

    if (populate && populate.includes(ENTITY_NAMES.PRODUCTS)) {
      reviewsResult = reviewsResult.map(review => ({
        ...review,
        product: this.productsService.findOne(review.product as Product['id']).data,
      }))
    }

    return {
      data: reviewsResult,
      message: `Retrieved ${total} review`,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  findOne(id: string, populate?: (typeof REVIEWS_POPULATE_OPTIONS)[number][]) {
    let reviewResult = this.reviewsData.find(review => review.id === id)
    if (!reviewResult) {
      throw new NotFoundException('Review not found')
    }

    if (populate && populate.includes(ENTITY_NAMES.USERS)) {
      reviewResult = {
        ...reviewResult,
        user: this.usersService.findOne(reviewResult.user as User['id']).data,
      }
    }

    if (populate && populate.includes(ENTITY_NAMES.PRODUCTS)) {
      reviewResult = {
        ...reviewResult,
        product: this.productsService.findOne(reviewResult.product as Product['id']).data,
      }
    }

    return {
      data: reviewResult,
      message: 'Review found successfully',
    }
  }

  async update(id: string, data: UpdateReviewDto) {
    try {
      const review = this.reviewsData.find(review => review.id === id)
      if (!review) {
        throw new NotFoundException('Review not found')
      }

      if (data.user) {
        EntityValidationUtil.validateEntityExists(data.user, this.usersService, 'User')
      }

      if (data.product) {
        EntityValidationUtil.validateEntityExists(data.product, this.productsService, 'Product')
      }

      const updatedReview = {
        ...review,
        ...data,
        updatedAt: new Date(),
      }

      this.reviewsData = this.reviewsData.map(review => (review.id === id ? updatedReview : review))

      await FilePersistenceUtil.persistData(this.reviewsFileData, this.reviewsData)

      return {
        message: 'Review updated successfully',
        data: updatedReview,
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }

      console.error('Error updating review:', error)
      throw new Error('Failed to update review. Please try again later.')
    }
  }

  async remove(id: string) {
    try {
      const review = this.reviewsData.find(review => review.id === id)
      if (!review) {
        throw new NotFoundException('Review not found')
      }

      this.reviewsData = this.reviewsData.filter(review => review.id !== id)

      await FilePersistenceUtil.persistData(this.reviewsFileData, this.reviewsData)

      return {
        message: `Review deleted successfully`,
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }

      console.error('Error removing review:', error)
      throw new Error('Failed to remove review. Please try again later.')
    }
  }

  getTotalByProduct(productId: string) {
    return this.reviewsData.filter(review => review.product === productId).length
  }
}
