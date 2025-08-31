import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator'

import { UserRole } from '../entities/user.entity'

export class CreateUserDto {
  @IsEmail()
  email: string

  @IsString()
  password: string

  @IsString()
  firstName: string

  @IsString()
  lastName: string

  @IsString()
  nickname: string

  @IsOptional()
  @IsString()
  avatar?: string

  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole

  @IsString()
  phone: string

  @IsString()
  address: string
}
