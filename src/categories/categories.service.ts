import * as path from 'path'

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'

import { CheckSlugUtil } from '../utils/check-slug.util'
import { FilePersistenceUtil } from '../utils/file-persistence.util'

import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { Category } from './entities/category.entity'

@Injectable()
export class CategoriesService {
  private readonly categoriesFileData = path.join(process.cwd(), 'src', 'data', 'categories.json')
  private categoriesData: Category[] = []

  private async loadData(): Promise<void> {
    try {
      this.categoriesData = await FilePersistenceUtil.readData<Category[]>(this.categoriesFileData)
    } catch (error) {
      console.error('Error loading categories data:', error)
      this.categoriesData = []
    }
  }

  constructor() {
    this.loadData().catch(error => console.error('Failed to load data:', error))
  }

  private checkSlug(data: CreateCategoryDto | UpdateCategoryDto, entityId?: string): string {
    const baseText = data.slug || data.name
    return CheckSlugUtil.checkSlug(baseText, this.categoriesData, entityId)
  }

  async create(data: CreateCategoryDto) {
    try {
      const newCategory = {
        id: uuidv4(),
        slug: this.checkSlug(data),
        ...data,
        createdAt: new Date(),
      }

      if (data.parentId) {
        const parentCategory = this.findOne(data.parentId)
        if (!parentCategory) {
          throw new NotFoundException('Parent category not found')
        }
      }

      this.categoriesData.push(newCategory)

      await FilePersistenceUtil.persistData(this.categoriesFileData, this.categoriesData)

      return {
        data: newCategory,
        message: 'Category created successfully',
      }
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error
      }

      console.error('Error creating category:', error)
      throw new Error('Failed to create category. Please try again later.')
    }
  }

  findAll(limit?: number, page?: number, pagination: boolean = true) {
    let categoriesResult: Category[]

    if (pagination) {
      categoriesResult = this.categoriesData
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
      categoriesResult = this.categoriesData.slice(startIndex, endIndex)
    }

    const total = categoriesResult.length

    return {
      data: categoriesResult,
      message: `Retrieved ${total} categories`,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  findOne(id: string) {
    const category = this.categoriesData.find(category => category.id === id)
    if (!category) {
      throw new NotFoundException('Category not found')
    }

    return {
      data: category,
      message: 'Category found successfully',
    }
  }

  async update(id: string, data: UpdateCategoryDto) {
    try {
      const category = this.categoriesData.find(category => category.id === id)
      if (!category) {
        throw new NotFoundException('Category not found')
      }

      const updatedCategory = {
        ...category,
        ...data,
        slug: this.checkSlug(data, id),
        updatedAt: new Date(),
      }

      this.categoriesData = this.categoriesData.map(category =>
        category.id === id ? updatedCategory : category,
      )

      await FilePersistenceUtil.persistData(this.categoriesFileData, this.categoriesData)

      return {
        message: `Category updated successfully`,
        data: updatedCategory,
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }

      console.error('Error updating category:', error)
      throw new Error('Failed to update category. Please try again later.')
    }
  }

  async remove(id: string, cascade: boolean = false) {
    try {
      const category = this.categoriesData.find(category => category.id === id)
      if (!category) {
        throw new NotFoundException('Category not found')
      }

      if (cascade) {
        this.categoriesData = this.categoriesData.filter(category => category.parentId !== id)
      } else {
        const childCategories = this.categoriesData.filter(category => category.parentId === id)
        childCategories.map(category => (category.parentId = null))
      }

      this.categoriesData = this.categoriesData.filter(category => category.id !== id)

      await FilePersistenceUtil.persistData(this.categoriesFileData, this.categoriesData)

      return {
        message: `Category ${category.name} deleted successfully`,
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }

      console.error('Error removing category:', error)
      throw new Error('Failed to remove category. Please try again later.')
    }
  }
}
