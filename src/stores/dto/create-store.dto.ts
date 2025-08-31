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
  @IsString()
  storeCode: string

  @IsString()
  name: string

  @IsString()
  slug: string

  @IsOptional()
  @IsString()
  description?: string

  @IsArray()
  @IsUUID('4', { each: true })
  categories: string[]

  @IsOptional()
  @IsUrl()
  logo?: string

  @IsOptional()
  @IsUrl()
  banner?: string

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean = false

  @IsOptional()
  @IsDateString()
  verifiedAt?: string
}
