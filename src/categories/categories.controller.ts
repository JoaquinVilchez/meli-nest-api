import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common'
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'

import { TransformInterceptor } from '../interceptors/transform/transform.interceptor'

import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

@ApiTags('categories')
@UseInterceptors(TransformInterceptor)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva categoría' })
  @ApiResponse({ status: 201, description: 'Categoría creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto)
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de categorías con paginación' })
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
  @ApiResponse({ status: 200, description: 'Lista de categorías obtenida exitosamente' })
  findAll(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('pagination') pagination: boolean = true,
  ) {
    return this.categoriesService.findAll(limit, page, pagination)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una categoría por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID único de la categoría',
    example: '7ecb9c98-4c28-454f-ba99-654a4688ab21',
  })
  @ApiResponse({ status: 200, description: 'Categoría encontrada exitosamente' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una categoría existente' })
  @ApiParam({
    name: 'id',
    description: 'ID único de la categoría',
    example: '7ecb9c98-4c28-454f-ba99-654a4688ab21',
  })
  @ApiResponse({ status: 200, description: 'Categoría actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  async update(@Param('id') id: string, @Body() data: UpdateCategoryDto) {
    return await this.categoriesService.update(id, data)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una categoría' })
  @ApiParam({
    name: 'id',
    description: 'ID único de la categoría',
    example: '7ecb9c98-4c28-454f-ba99-654a4688ab21',
  })
  @ApiQuery({
    name: 'cascade',
    required: false,
    description: 'Eliminar categorías hijas en cascada',
    example: false,
  })
  @ApiResponse({ status: 200, description: 'Categoría eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  @ApiResponse({ status: 400, description: 'No se puede eliminar categoría con subcategorías' })
  async remove(@Param('id') id: string, @Query('cascade') cascade: boolean = false) {
    return await this.categoriesService.remove(id, cascade)
  }
}
