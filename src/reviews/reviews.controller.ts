import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'

import { ValidatePopulate } from '../decorators/populate/populate.decorator'
import { RequestPopulate } from '../types/request-populate.type'
import { REVIEWS_POPULATE_OPTIONS } from '../utils/constants.util'

import { CreateReviewDto } from './dto/create-review.dto'
import { UpdateReviewDto } from './dto/update-review.dto'
import { ReviewsService } from './reviews.service'

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva reseña de producto' })
  @ApiResponse({ status: 201, description: 'Reseña creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  create(@Body() data: CreateReviewDto) {
    return this.reviewsService.create(data)
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de reseñas con paginación' })
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
  @ApiQuery({
    name: 'populate',
    required: false,
    description: 'Relaciones a incluir',
    example: '["users", "products"]',
  })
  @ApiResponse({ status: 200, description: 'Lista de reseñas obtenida exitosamente' })
  @ValidatePopulate(Object.values(REVIEWS_POPULATE_OPTIONS))
  findAll(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('pagination') pagination: boolean = true,
    @Req() request: RequestPopulate,
  ) {
    const validatedPopulate = (request.validatedPopulate ||
      []) as (typeof REVIEWS_POPULATE_OPTIONS)[number][]

    return this.reviewsService.findAll(limit, page, validatedPopulate, pagination)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una reseña por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID único de la reseña',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiQuery({
    name: 'populate',
    required: false,
    description: 'Relaciones a incluir',
    example: '["users", "products"]',
  })
  @ApiResponse({ status: 200, description: 'Reseña encontrada exitosamente' })
  @ApiResponse({ status: 404, description: 'Reseña no encontrada' })
  @ValidatePopulate(Object.values(REVIEWS_POPULATE_OPTIONS))
  findOne(@Param('id') id: string, @Req() request: RequestPopulate) {
    const validatedPopulate = (request.validatedPopulate ||
      []) as (typeof REVIEWS_POPULATE_OPTIONS)[number][]

    return this.reviewsService.findOne(id, validatedPopulate)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una reseña existente' })
  @ApiParam({
    name: 'id',
    description: 'ID único de la reseña',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({ status: 200, description: 'Reseña actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Reseña no encontrada' })
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(id, updateReviewDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una reseña' })
  @ApiParam({
    name: 'id',
    description: 'ID único de la reseña',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({ status: 200, description: 'Reseña eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Reseña no encontrada' })
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id)
  }
}
