import { IsString, IsUUID } from 'class-validator'

export class CreateQuestionDto {
  @IsUUID(4)
  product: string

  @IsUUID(4)
  user: string

  @IsString()
  content: string
}
