import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Min,
} from 'class-validator'

import { CONDITIONS, CURRENCIES, SHIPPING } from '../../utils/constants.util'

export class CreateProductDto {
  @ApiProperty({
    description: 'Título del producto',
    example: 'iPhone 15 Pro Max 256GB Titanio Natural',
    minLength: 1,
    maxLength: 200,
  })
  @IsString()
  title: string

  @ApiProperty({
    description: 'Descripción corta del producto',
    example: 'El iPhone más avanzado con chip A17 Pro, cámara de 48MP y diseño en titanio',
    minLength: 1,
    maxLength: 500,
  })
  @IsString()
  description: string

  @ApiPropertyOptional({
    description: 'Descripción larga y detallada del producto',
    example: 'El iPhone 15 Pro Max representa la máxima expresión de innovación de Apple...',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  longDescription?: string

  @ApiProperty({
    description: 'Precio del producto',
    example: 2499999,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number

  @ApiProperty({
    description: 'Moneda del precio',
    enum: CURRENCIES,
    example: 'ARS',
  })
  @IsEnum(CURRENCIES)
  currency: (typeof CURRENCIES)[number]

  @ApiProperty({
    description: 'ID de la categoría del producto',
    example: '7ecb9c98-4c28-454f-ba99-654a4688ab21',
    format: 'uuid',
  })
  @IsUUID(4)
  category: string

  @ApiProperty({
    description: 'ID de la tienda que vende el producto',
    example: '60c754f5-322e-4c67-8cda-388d0e35750c',
    format: 'uuid',
  })
  @IsUUID(4)
  store: string

  @ApiProperty({
    description: 'URLs de las imágenes del producto',
    example: [
      'https://example.com/products/iphone15-pro-max-1.jpg',
      'https://example.com/products/iphone15-pro-max-2.jpg',
    ],
    type: [String],
    minItems: 1,
  })
  @IsArray()
  @IsUrl({}, { each: true })
  @ArrayMinSize(1)
  images: string[]

  @ApiProperty({
    description: 'Condición del producto',
    enum: CONDITIONS,
    example: 'new',
  })
  @IsEnum(CONDITIONS)
  condition: (typeof CONDITIONS)[number]

  @ApiProperty({
    description: 'Tipo de envío',
    enum: SHIPPING,
    example: 'standard',
  })
  @IsEnum(SHIPPING)
  shipping: (typeof SHIPPING)[number]

  @ApiProperty({
    description: 'Cantidad disponible en stock',
    example: 45,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  stock: number
}
