import { IsNumber, IsString, IsUUID, Max, Min } from 'class-validator'

export class CreateReviewDto {
  @IsUUID(4)
  user: string

  @IsUUID(4)
  store: string

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number

  @IsString()
  comment: string
}
