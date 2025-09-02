import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID } from 'class-validator'

export class CreateAnswerDto {
  @ApiProperty({
    description: 'ID de la pregunta a la que se responde',
    example: 'd32ab919-9266-4611-b4ab-2ad5c2190af4',
    format: 'uuid',
  })
  @IsUUID(4)
  question: string

  @ApiProperty({
    description: 'ID del usuario que responde la pregunta',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
  })
  @IsUUID(4)
  user: string

  @ApiProperty({
    description: 'Contenido de la respuesta',
    example: 'Sí, el producto incluye cargador original. La entrega es de 2-3 días hábiles.',
    minLength: 1,
    maxLength: 1000,
  })
  @IsString()
  content: string
}
