import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator'

import { UserRole } from '../entities/user.entity'

export class CreateUserDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@ejemplo.com',
    format: 'email',
  })
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'miPassword123',
    minLength: 6,
  })
  @IsString()
  password: string

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  firstName: string

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  lastName: string

  @ApiProperty({
    description: 'Nickname del usuario',
    example: 'juanperez',
    minLength: 1,
    maxLength: 30,
  })
  @IsString()
  nickname: string

  @ApiPropertyOptional({
    description: 'URL del avatar del usuario',
    example: 'https://example.com/avatars/juan-avatar.jpg',
  })
  @IsOptional()
  @IsString()
  avatar?: string

  @ApiPropertyOptional({
    description: 'Estado activo del usuario',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @ApiPropertyOptional({
    description: 'Rol del usuario en el sistema',
    enum: UserRole,
    example: UserRole.CUSTOMER,
    default: UserRole.CUSTOMER,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole

  @ApiProperty({
    description: 'Número de teléfono del usuario',
    example: '+54 11 1234-5678',
    minLength: 1,
    maxLength: 20,
  })
  @IsString()
  phone: string

  @ApiProperty({
    description: 'Dirección del usuario',
    example: 'Av. Corrientes 1234, Buenos Aires, Argentina',
    minLength: 1,
    maxLength: 200,
  })
  @IsString()
  address: string
}
