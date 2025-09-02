import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'

import { ValidatePopulate } from '../decorators/populate/populate.decorator'
import { RequestPopulate } from '../types/request-populate.type'
import { PRODUCTS_POPULATE_OPTIONS } from '../utils/constants.util'

import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { ProductsService } from './products.service'

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  create(@Body() data: CreateProductDto) {
    return this.productsService.create(data)
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de productos con paginación' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Número de elementos por página',
    example: 10,
  })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', example: 1 })
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
    example: '["categories", "stores"]',
  })
  @ApiResponse({ status: 200, description: 'Lista de productos obtenida exitosamente' })
  @ValidatePopulate(Object.values(PRODUCTS_POPULATE_OPTIONS))
  findAll(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('pagination') pagination: boolean = true,
    @Req() request: RequestPopulate,
  ) {
    const validatedPopulate = (request.validatedPopulate ||
      []) as (typeof PRODUCTS_POPULATE_OPTIONS)[number][]

    return this.productsService.findAll(limit, page, validatedPopulate, pagination)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID único del producto',
    example: 'e0207c9f-6533-48cd-a64d-8c68345f5e0e',
  })
  @ApiQuery({
    name: 'populate',
    required: false,
    description: 'Relaciones a incluir',
    example: '["categories", "stores"]',
  })
  @ApiResponse({ status: 200, description: 'Producto encontrado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ValidatePopulate(Object.values(PRODUCTS_POPULATE_OPTIONS))
  findOne(@Param('id') id: string, @Req() request: RequestPopulate) {
    const validatedPopulate = (request.validatedPopulate ||
      []) as (typeof PRODUCTS_POPULATE_OPTIONS)[number][]

    return this.productsService.findOne(id, validatedPopulate)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un producto existente' })
  @ApiParam({
    name: 'id',
    description: 'ID único del producto',
    example: 'e0207c9f-6533-48cd-a64d-8c68345f5e0e',
  })
  @ApiResponse({ status: 200, description: 'Producto actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  update(@Param('id') id: string, @Body() data: UpdateProductDto) {
    return this.productsService.update(id, data)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiParam({
    name: 'id',
    description: 'ID único del producto',
    example: 'e0207c9f-6533-48cd-a64d-8c68345f5e0e',
  })
  @ApiResponse({ status: 200, description: 'Producto eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id)
  }
}
