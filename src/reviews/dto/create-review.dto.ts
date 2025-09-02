import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString, IsUUID, Max, Min } from 'class-validator'

export class CreateReviewDto {
  @ApiProperty({
    description: 'ID del usuario que hace la reseña',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
  })
  @IsUUID(4)
  user: string

  @ApiProperty({
    description: 'ID del producto que se está reseñando',
    example: 'e0207c9f-6533-48cd-a64d-8c68345f5e0e',
    format: 'uuid',
  })
  @IsUUID(4)
  product: string

  @ApiProperty({
    description: 'Calificación del producto (1-5 estrellas)',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number

  @ApiProperty({
    description: 'Comentario de la reseña',
    example: 'Excelente producto, muy buena calidad y entrega rápida. Lo recomiendo.',
    minLength: 1,
    maxLength: 1000,
  })
  @IsString()
  comment: string
}
