import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateCategoryDto {
  @IsString()
  name: string

  @IsString()
  @IsOptional()
  slug: string

  @IsUUID()
  @IsOptional()
  parentId: string | null

  @IsBoolean()
  isActive: boolean
}
