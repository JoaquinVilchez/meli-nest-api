import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
} from 'class-validator'

export class CreateStoreDto {
  @ApiProperty({
    description: 'Código único de la tienda',
    example: 'STORE001',
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  storeCode: string

  @ApiProperty({
    description: 'Nombre de la tienda',
    example: 'TechStore Argentina',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  name: string

  @ApiProperty({
    description: 'Slug único para la URL',
    example: 'techstore-argentina',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  slug: string

  @ApiPropertyOptional({
    description: 'Descripción de la tienda',
    example: 'Tienda especializada en productos tecnológicos de última generación',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({
    description: 'IDs de las categorías en las que opera la tienda',
    example: ['7ecb9c98-4c28-454f-ba99-654a4688ab21', '8fdc9d09-5d39-565g-cb00-765b5799bc32'],
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  categories: string[]

  @ApiPropertyOptional({
    description: 'URL del logo de la tienda',
    example: 'https://example.com/logos/techstore-logo.png',
  })
  @IsOptional()
  @IsUrl()
  logo?: string

  @ApiPropertyOptional({
    description: 'URL del banner de la tienda',
    example: 'https://example.com/banners/techstore-banner.jpg',
  })
  @IsOptional()
  @IsUrl()
  banner?: string

  @ApiPropertyOptional({
    description: 'Estado activo de la tienda',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true

  @ApiPropertyOptional({
    description: 'Estado de verificación de la tienda',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean = false

  @ApiPropertyOptional({
    description: 'Fecha de verificación de la tienda',
    example: '2025-01-15T10:30:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  verifiedAt?: string
}
