import { BadRequestException } from '@nestjs/common'

export class CheckSlugUtil {
  static isSlugUnique<T extends { id: string; slug: string }>(
    slug: string,
    collection: T[],
    entityId?: string,
  ): boolean {
    if (entityId) {
      const existingEntity = collection.find(
        entity => entity.slug === slug && entity.id !== entityId,
      )
      return !existingEntity
    } else {
      const existingEntity = collection.find(entity => entity.slug === slug)
      return !existingEntity
    }
  }

  static generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  static checkSlug<T extends { id: string; slug: string }>(
    baseText: string,
    collection: T[],
    entityId?: string,
  ): string {
    try {
      const finalSlug = this.generateSlug(baseText)

      if (!this.isSlugUnique(finalSlug, collection, entityId)) {
        throw new BadRequestException(`Slug '${finalSlug}' already exists`)
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
}
