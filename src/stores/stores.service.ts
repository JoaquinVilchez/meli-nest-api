import * as path from 'path'

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'

import { CategoriesService } from '../categories/categories.service'
import { Category } from '../categories/entities/category.entity'
import { CheckSlugUtil } from '../utils/check-slug.util'
import { ENTITY_NAMES, STORES_POPULATE_OPTIONS } from '../utils/constants.util'
import { EntityValidationUtil } from '../utils/entity-validation.util'
import { FilePersistenceUtil } from '../utils/file-persistence.util'

import { CreateStoreDto } from './dto/create-store.dto'
import { UpdateStoreDto } from './dto/update-store.dto'
import { Store } from './entities/store.entity'

@Injectable()
export class StoresService {
  private readonly storesFileData = path.join(process.cwd(), 'src', 'data', 'stores.json')
  private storesData: Store[] = []

  private async loadData(): Promise<void> {
    try {
      this.storesData = await FilePersistenceUtil.readData<Store[]>(this.storesFileData)
    } catch (error) {
      console.error('Error loading stores data:', error)
      this.storesData = []
    }
  }

  constructor(private readonly categoriesService: CategoriesService) {
    this.loadData().catch(error => console.error('Failed to load data:', error))
  }

  private checkSlug(data: CreateStoreDto | UpdateStoreDto, entityId?: string): string {
    const baseText = data.slug || data.name
    return CheckSlugUtil.checkSlug(baseText, this.storesData, entityId)
  }

  private handleVerifiedAt(
    currentStore: Store | null,
    updateData: CreateStoreDto | UpdateStoreDto,
  ): Date | null {
    if (updateData.isVerified && (!currentStore || !currentStore.isVerified)) {
      return new Date()
    }

    if (currentStore && updateData.isVerified && currentStore.isVerified) {
      return currentStore.verifiedAt
    }

    if (updateData.isVerified === false) {
      return null
    }
    return currentStore?.verifiedAt || null
  }

  async create(data: CreateStoreDto) {
    try {
      data.categories.forEach(category => {
        EntityValidationUtil.validateEntityExists(category, this.categoriesService, 'Category')
      })

      const newStore = {
        id: uuidv4(),
        ...data,
        isActive: data.isActive ?? true,
        isVerified: data.isVerified ?? false,
        verifiedAt: this.handleVerifiedAt(null, data),
        slug: this.checkSlug(data),
        createdAt: new Date(),
      }

      this.storesData.push(newStore)
      await FilePersistenceUtil.persistData(this.storesFileData, this.storesData)

      return {
        data: newStore,
        message: 'Store created successfully',
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error
      }
      console.error('Error creating store:', error)
      throw new Error('Failed to create store. Please try again later.')
    }
  }

  findAll(
    limit?: number,
    page?: number,
    populate: (typeof STORES_POPULATE_OPTIONS)[number][] = [],
    pagination: boolean = true,
  ) {
    let storesResult: Store[]

    if (!pagination) {
      storesResult = this.storesData
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
      storesResult = this.storesData.slice(startIndex, endIndex)
    }

    const total = storesResult.length

    if (populate && populate.includes(ENTITY_NAMES.CATEGORIES)) {
      storesResult = storesResult.map(store => ({
        ...store,
        categories: store.categories.map(categoryId => {
          const categoryResult = this.categoriesService.findOne(categoryId as Category['id'])
          return categoryResult.data
        }),
      }))
    }

    return {
      data: storesResult,
      message: `Retrieved ${total} stores`,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  findOne(id: string, populate?: (typeof STORES_POPULATE_OPTIONS)[number][]) {
    const store = this.storesData.find(store => store.id === id)
    if (!store) {
      throw new NotFoundException('Store not found')
    }

    let storeResult = store

    if (populate && populate.includes(ENTITY_NAMES.CATEGORIES)) {
      storeResult = {
        ...storeResult,
        categories: storeResult.categories.map(categoryId => {
          const categoryResult = this.categoriesService.findOne(categoryId as Category['id'])
          return categoryResult.data
        }),
      }
    }

    return {
      data: storeResult,
      message: 'Store found successfully',
    }
  }

  async update(id: string, data: UpdateStoreDto) {
    try {
      const store = this.storesData.find(store => store.id === id)
      if (!store) {
        throw new NotFoundException('Store not found')
      }

      if (data.categories) {
        data.categories.forEach(category => {
          EntityValidationUtil.validateEntityExists(category, this.categoriesService, 'Category')
        })
      }

      const updatedStore = {
        ...store,
        ...data,
        slug: this.checkSlug(data, id),
        verifiedAt: this.handleVerifiedAt(store, data),
        updatedAt: new Date(),
      }

      this.storesData = this.storesData.map(store => (store.id === id ? updatedStore : store))

      await FilePersistenceUtil.persistData(this.storesFileData, this.storesData)

      return {
        message: `Store updated successfully`,
        data: updatedStore,
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }

      console.error('Error updating store:', error)
      throw new Error('Failed to update store. Please try again later.')
    }
  }

  async remove(id: string) {
    try {
      const store = this.storesData.find(store => store.id === id)
      if (!store) {
        throw new NotFoundException('Store not found')
      }

      this.storesData = this.storesData.filter(store => store.id !== id)

      await FilePersistenceUtil.persistData(this.storesFileData, this.storesData)

      return {
        message: `Store "${store.name}" deleted successfully`,
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }

      console.error('Error removing store:', error)
      throw new Error('Failed to remove store. Please try again later.')
    }
  }
}
