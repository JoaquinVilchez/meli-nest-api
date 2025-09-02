import { NotFoundException } from '@nestjs/common'

export class EntityValidationUtil {
  static validateEntityExists<T>(
    entityId: string,
    service: { findOne: (id: string) => { data: T } },
    entityName: string,
  ) {
    try {
      const entity = service.findOne(entityId).data
      if (!entity) {
        throw new NotFoundException(`${entityName} not found`)
      }
      return entity
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      console.error(`Error checking ${entityName}:`, error)
      throw new Error(`Failed to check ${entityName}. Please try again later.`)
    }
  }

  static async validateEntityExistsAsync<T>(
    entityId: string,
    service: { findOne: (id: string) => Promise<{ data: T }> },
    entityName: string,
  ) {
    try {
      const result = await service.findOne(entityId)
      if (!result.data) {
        throw new NotFoundException(`${entityName} not found`)
      }
      return result.data
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      console.error(`Error checking ${entityName}:`, error)
      throw new Error(`Failed to check ${entityName}. Please try again later.`)
    }
  }
}
