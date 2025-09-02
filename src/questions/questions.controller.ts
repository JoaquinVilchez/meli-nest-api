import { Body, Controller, Get, Post, Query } from '@nestjs/common'

import { CreateAnswerDto } from './dto/create-answer.dto'
import { CreateQuestionDto } from './dto/create-question.dto'
import { QuestionsService } from './questions.service'

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  createQuestion(@Body() data: CreateQuestionDto) {
    return this.questionsService.createQuestion(data)
  }

  @Post('answer')
  answerQuestion(@Body() data: CreateAnswerDto) {
    return this.questionsService.answerQuestion(data)
  }

  @Get()
  findAll(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('pagination') pagination: boolean = true,
  ) {
    return this.questionsService.findAll(limit, page, pagination)
  }
}
