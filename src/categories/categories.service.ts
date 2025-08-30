import * as fs from 'fs'
import * as path from 'path'

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'

import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { Category } from './entities/category.entity'

@Injectable()
export class CategoriesService {
  private readonly categoriesFileData = path.join(process.cwd(), 'src', 'data', 'categories.json')
  private categoriesData: Category[] = JSON.parse(
    fs.readFileSync(this.categoriesFileData, 'utf8'),
  ) as Category[]

  private async persistData(): Promise<void> {
    try {
      await fs.promises.writeFile(
        this.categoriesFileData,
        JSON.stringify(this.categoriesData, null, 2),
      )
    } catch (error) {
      console.error('Error persisting data:', error)
      throw new Error('Failed to persist data to file')
    }
  }

  private checkSlug(
    data: CreateCategoryDto | UpdateCategoryDto,
    isUpdate: boolean = false,
  ): string {
    try {
      const baseText = data.slug || data.name
      const finalSlug = baseText.toLowerCase().replace(/ /g, '-')

      const existingCategory = this.categoriesData.find(
        category => category.slug === finalSlug && !isUpdate,
      )

      if (existingCategory) {
        throw new BadRequestException('Category slug already exists')
      }

      return finalSlug
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error
      }

      console.error('Error checking slug:', error)
      throw new Error('Failed to check slug. Please try again later.')
    }
  }

  async create(data: CreateCategoryDto) {
    try {
      const newCategory = {
        id: uuidv4(),
        ...data,
        createdAt: new Date(),
      }

      newCategory.slug = this.checkSlug(data)

      if (data.parentId) {
        const parentCategory = this.findOne(data.parentId)
        if (!parentCategory) {
          throw new NotFoundException('Parent category not found')
        }
      }

      this.categoriesData.push(newCategory)

      await this.persistData()

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

  findAll(limit?: number, page?: number) {
    if (!page) {
      page = 1
    }
    if (!limit) {
      limit = 50
    }
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const categories = this.categoriesData.slice(startIndex, endIndex)
    const total = this.categoriesData.length

    return {
      data: categories,
      message: `Retrieved ${categories.length} categories`,
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
        updatedAt: new Date(),
      }

      const isUpdate = true

      updatedCategory.slug = this.checkSlug(data, isUpdate)

      this.categoriesData = this.categoriesData.map(category =>
        category.id === id ? updatedCategory : category,
      )

      await this.persistData()

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

      await this.persistData()

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
