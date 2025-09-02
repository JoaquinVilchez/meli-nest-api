import { IsString, IsUUID } from 'class-validator'

export class CreateAnswerDto {
  @IsUUID(4)
  question: string

  @IsUUID(4)
  user: string

  @IsString()
  content: string
}
