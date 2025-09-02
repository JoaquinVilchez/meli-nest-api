import * as path from 'path'

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'

import { AggregationService } from '../aggregation/aggregation.service'
import { CategoriesService } from '../categories/categories.service'
import { Category } from '../categories/entities/category.entity'
import { Store } from '../stores/entities/store.entity'
import { StoresService } from '../stores/stores.service'
import { ENTITY_NAMES, PRODUCTS_POPULATE_OPTIONS } from '../utils/constants.util'
import { EntityValidationUtil } from '../utils/entity-validation.util'
import { FilePersistenceUtil } from '../utils/file-persistence.util'

import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { Product } from './entities/product.entity'

@Injectable()
export class ProductsService {
  private readonly productsFileData = path.join(process.cwd(), 'src', 'data', 'products.json')
  private productsData: Product[] = []

  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly storesService: StoresService,
    private readonly aggregationService: AggregationService,
  ) {
    this.loadData().catch(error => console.error('Failed to load data:', error))
  }

  private async loadData(): Promise<void> {
    try {
      this.productsData = await FilePersistenceUtil.readData<Product[]>(this.productsFileData)
    } catch (error) {
      console.error('Error loading products data:', error)
      this.productsData = []
    }
  }

  async create(data: CreateProductDto) {
    try {
      EntityValidationUtil.validateEntityExists(data.category, this.categoriesService, 'Category')
      EntityValidationUtil.validateEntityExists(data.store, this.storesService, 'Store')

      const reviews = []
      const questions = []
      const opinions = []

      const newProduct = {
        id: uuidv4(),
        ...data,
        reviews,
        questions,
        opinions,
        createdAt: new Date(),
      }

      this.productsData.push(newProduct)
      await FilePersistenceUtil.persistData(this.productsFileData, this.productsData)

      return {
        data: newProduct,
        message: 'Product created successfully',
      }
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error
      }

      console.error('Error creating product:', error)
      throw new Error('Failed to create product. Please try again later.')
    }
  }

  async findAll(
    limit?: number,
    page?: number,
    populate: (typeof PRODUCTS_POPULATE_OPTIONS)[number][] = [],
    pagination: boolean = true,
  ) {
    let productsResult: Product[]

    if (!pagination) {
      productsResult = this.productsData
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
      productsResult = this.productsData.slice(startIndex, endIndex)
    }

    const total = productsResult.length
    const ratings = await Promise.all(
      productsResult.map(product => this.aggregationService.calculateProductRating(product.id)),
    )
    const reviews = await Promise.all(
      productsResult.map(product => this.aggregationService.countProductReviews(product.id)),
    )

    productsResult = productsResult.map((product, index) => ({
      ...product,
      rating: ratings[index],
      reviews: reviews[index],
    }))

    if (populate && populate.includes(ENTITY_NAMES.CATEGORIES)) {
      productsResult = productsResult.map(product => ({
        ...product,
        category: this.categoriesService.findOne(product.category as Category['id']).data,
      }))
    }

    if (populate && populate.includes(ENTITY_NAMES.STORES)) {
      productsResult = productsResult.map(product => ({
        ...product,
        store: this.storesService.findOne(product.store as Store['id']).data,
      }))
    }

    // Questions are already populated in the product data
    // if (populate && populate.includes(ENTITY_NAMES.QUESTIONS)) {
    //   productsResult = productsResult.map(product => ({
    //     ...product,
    //     questions: product.questions.map(
    //       question => this.questionsService.findOne(question as Question['id']).data,
    //     ),
    //   }))
    // }

    return {
      data: productsResult,
      message: `Retrieved ${total} products`,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async findOne(id: string, populate?: (typeof PRODUCTS_POPULATE_OPTIONS)[number][]) {
    let productResult = this.productsData.find(product => product.id === id)
    if (!productResult) {
      throw new NotFoundException('Product not found')
    }

    const rating = await this.aggregationService.calculateProductRating(productResult.id)
    const reviews = await this.aggregationService.countProductReviews(productResult.id)

    productResult = {
      ...productResult,
      rating,
      reviews,
    }

    if (populate && populate.includes(ENTITY_NAMES.CATEGORIES)) {
      productResult = {
        ...productResult,
        category: this.categoriesService.findOne(productResult.category as Category['id']).data,
      }
    }

    if (populate && populate.includes(ENTITY_NAMES.STORES)) {
      productResult = {
        ...productResult,
        store: this.storesService.findOne(productResult.store as Store['id']).data,
      }
    }

    // if (populate && populate.includes(ENTITY_NAMES.QUESTIONS)) {
    //   productResult = {
    //     ...productResult,
    //     questions: productResult.questions.map(
    //       question => this.questionsService.findOne(question as Question['id']).data,
    //     ),
    //   }
    // }

    return {
      data: productResult,
      message: 'Product found successfully',
    }
  }

  async update(id: string, data: UpdateProductDto) {
    try {
      const product = this.productsData.find(product => product.id === id)
      if (!product) {
        throw new NotFoundException('Product not found')
      }

      if (data.category) {
        EntityValidationUtil.validateEntityExists(data.category, this.categoriesService, 'Category')
      }

      if (data.store) {
        EntityValidationUtil.validateEntityExists(data.store, this.storesService, 'Store')
      }

      const updatedProduct = {
        ...product,
        ...data,
        updatedAt: new Date(),
      }

      this.productsData = this.productsData.map(product =>
        product.id === id ? updatedProduct : product,
      )

      await FilePersistenceUtil.persistData(this.productsFileData, this.productsData)

      return {
        message: 'Product updated successfully',
        data: updatedProduct,
      }
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error
      }

      console.error('Error updating product:', error)
      throw new Error('Failed to update product. Please try again later.')
    }
  }

  async remove(id: string) {
    try {
      const product = this.productsData.find(product => product.id === id)
      if (!product) {
        throw new NotFoundException('Product not found')
      }

      this.productsData = this.productsData.filter(product => product.id !== id)

      await FilePersistenceUtil.persistData(this.productsFileData, this.productsData)

      return {
        message: `Product "${product.title}" deleted successfully`,
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }

      console.error('Error removing product:', error)
      throw new Error('Failed to remove product. Please try again later.')
    }
  }
}
