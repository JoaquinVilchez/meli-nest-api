import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID } from 'class-validator'

export class CreateQuestionDto {
  @ApiProperty({
    description: 'ID del producto sobre el que se hace la pregunta',
    example: 'e0207c9f-6533-48cd-a64d-8c68345f5e0e',
    format: 'uuid',
  })
  @IsUUID(4)
  product: string

  @ApiProperty({
    description: 'ID del usuario que hace la pregunta',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
  })
  @IsUUID(4)
  user: string

  @ApiProperty({
    description: 'Contenido de la pregunta',
    example: '¿Este producto incluye cargador? ¿Cuánto tiempo tarda la entrega?',
    minLength: 1,
    maxLength: 500,
  })
  @IsString()
  content: string
}
