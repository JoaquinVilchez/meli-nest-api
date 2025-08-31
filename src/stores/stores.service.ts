import * as path from 'path'

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'

import { CategoriesService } from '../categories/categories.service'
import { Category } from '../categories/entities/category.entity'
import { CheckSlugUtil } from '../utils/check-slug.util'
import { ENTITY_NAMES } from '../utils/constants.util'
import { FilePersistenceUtil } from '../utils/file-persistence.util'

import { CreateStoreDto } from './dto/create-store.dto'
import { UpdateStoreDto } from './dto/update-store.dto'
import { Store } from './entities/store.entity'

@Injectable()
export class StoresService {
  private readonly storesFileData = path.join(process.cwd(), 'src', 'data', 'stores.json')
  private storesData: Store[] = []
  private readonly categoriesService = new CategoriesService()

  private async loadData(): Promise<void> {
    try {
      this.storesData = await FilePersistenceUtil.readData<Store[]>(this.storesFileData)
    } catch (error) {
      console.error('Error loading stores data:', error)
      this.storesData = []
    }
  }

  constructor() {
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
        try {
          const categoryData = this.categoriesService.findOne(category)
          if (!categoryData) {
            throw new NotFoundException('Category not found')
          }
        } catch (error) {
          if (error instanceof NotFoundException) {
            throw error
          }
          console.error('Error checking category:', error)
          throw new Error('Failed to check category. Please try again later.')
        }
      })

      const newStore = {
        id: uuidv4(),
        ...data,
        isActive: data.isActive ?? true,
        isVerified: data.isVerified ?? false,
        verifiedAt: this.handleVerifiedAt(null, data),
        slug: this.checkSlug(data),
        createdAt: new Date(),
        updatedAt: new Date(),
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

  findAll(limit?: number, page?: number, populate: (typeof ENTITY_NAMES.CATEGORIES)[] = []) {
    if (!page) {
      page = 1
    }
    if (!limit) {
      limit = 50
    }
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const stores = this.storesData.slice(startIndex, endIndex)
    const total = this.storesData.length

    if (populate.includes(ENTITY_NAMES.CATEGORIES)) {
      stores.forEach(store => {
        store.categories = store.categories.map(categoryId => {
          const categoryResult = this.categoriesService.findOne(categoryId as Category['id'])
          return categoryResult.data
        })
      })
    }

    return {
      data: stores,
      message: `Retrieved ${stores.length} stores`,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  findOne(id: string, populate: (typeof ENTITY_NAMES.CATEGORIES)[] = []) {
    const store = this.storesData.find(store => store.id === id)
    if (!store) {
      throw new NotFoundException('Store not found')
    }

    if (populate.includes(ENTITY_NAMES.CATEGORIES)) {
      store.categories = store.categories.map(categoryId => {
        const categoryResult = this.categoriesService.findOne(categoryId as Category['id'])
        return categoryResult.data
      })
    }

    return {
      data: store,
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
          try {
            const categoryData = this.categoriesService.findOne(category)
            if (!categoryData) {
              throw new NotFoundException('Category not found')
            }
          } catch (error) {
            if (error instanceof NotFoundException) {
              throw error
            }
            console.error('Error checking category:', error)
            throw new Error('Failed to check category. Please try again later.')
          }
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

  // TODO: Add cascade option for products
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
