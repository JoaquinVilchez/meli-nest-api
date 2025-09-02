import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Electrónicos',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  name: string

  @ApiPropertyOptional({
    description: 'Slug único para la URL (se genera automáticamente si no se proporciona)',
    example: 'electronicos',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  slug: string

  @ApiPropertyOptional({
    description: 'ID de la categoría padre (para crear subcategorías)',
    example: '7ecb9c98-4c28-454f-ba99-654a4688ab21',
    format: 'uuid',
  })
  @IsUUID()
  @IsOptional()
  parentId: string | null

  @ApiProperty({
    description: 'Estado activo de la categoría',
    example: true,
  })
  @IsBoolean()
  isActive: boolean
}
