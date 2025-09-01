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
  @IsString()
  title: string

  @IsString()
  description: string

  @IsOptional()
  @IsString()
  longDescription?: string

  @IsNumber()
  @Min(0)
  price: number

  @IsEnum(CURRENCIES)
  currency: (typeof CURRENCIES)[number]

  @IsUUID(4)
  category: string

  @IsUUID(4)
  store: string

  @IsArray()
  @IsUrl({}, { each: true })
  @ArrayMinSize(1)
  images: string[]

  @IsEnum(CONDITIONS)
  condition: (typeof CONDITIONS)[number]

  @IsEnum(SHIPPING)
  shipping: (typeof SHIPPING)[number]

  @IsNumber()
  @Min(0)
  stock: number
}
