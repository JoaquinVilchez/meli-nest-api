import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'

import { CreateAnswerDto } from './dto/create-answer.dto'
import { CreateQuestionDto } from './dto/create-question.dto'
import { QuestionsService } from './questions.service'

@ApiTags('questions')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva pregunta sobre un producto' })
  @ApiResponse({ status: 201, description: 'Pregunta creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  createQuestion(@Body() data: CreateQuestionDto) {
    return this.questionsService.createQuestion(data)
  }

  @Post('answer')
  @ApiOperation({ summary: 'Responder a una pregunta existente' })
  @ApiResponse({ status: 201, description: 'Respuesta creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Pregunta no encontrada' })
  answerQuestion(@Body() data: CreateAnswerDto) {
    return this.questionsService.answerQuestion(data)
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de preguntas con paginación' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Número de elementos por página',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número de página',
    example: 1,
  })
  @ApiQuery({
    name: 'pagination',
    required: false,
    description: 'Habilitar paginación',
    example: true,
  })
  @ApiResponse({ status: 200, description: 'Lista de preguntas obtenida exitosamente' })
  findAll(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('pagination') pagination: boolean = true,
  ) {
    return this.questionsService.findAll(limit, page, pagination)
  }
}
