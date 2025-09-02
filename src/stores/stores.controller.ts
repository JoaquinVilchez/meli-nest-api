import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'

import { ValidatePopulate } from '../decorators/populate/populate.decorator'
import { RequestPopulate } from '../types/request-populate.type'
import { STORES_POPULATE_OPTIONS } from '../utils/constants.util'

import { CreateStoreDto } from './dto/create-store.dto'
import { UpdateStoreDto } from './dto/update-store.dto'
import { StoresService } from './stores.service'

@ApiTags('stores')
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva tienda' })
  @ApiResponse({ status: 201, description: 'Tienda creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  create(@Body() data: CreateStoreDto) {
    return this.storesService.create(data)
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de tiendas con paginación' })
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
    example: '["categories"]',
  })
  @ApiResponse({ status: 200, description: 'Lista de tiendas obtenida exitosamente' })
  @ValidatePopulate(Object.values(STORES_POPULATE_OPTIONS))
  findAll(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('pagination') pagination: boolean = true,
    @Req() request: RequestPopulate,
  ) {
    const validatedPopulate = (request.validatedPopulate ||
      []) as (typeof STORES_POPULATE_OPTIONS)[number][]

    return this.storesService.findAll(limit, page, validatedPopulate, pagination)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una tienda por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID único de la tienda',
    example: '60c754f5-322e-4c67-8cda-388d0e35750c',
  })
  @ApiQuery({
    name: 'populate',
    required: false,
    description: 'Relaciones a incluir',
    example: '["categories"]',
  })
  @ApiResponse({ status: 200, description: 'Tienda encontrada exitosamente' })
  @ApiResponse({ status: 404, description: 'Tienda no encontrada' })
  @ValidatePopulate(Object.values(STORES_POPULATE_OPTIONS))
  findOne(@Param('id') id: string, @Req() request: RequestPopulate) {
    const validatedPopulate = (request.validatedPopulate ||
      []) as (typeof STORES_POPULATE_OPTIONS)[number][]

    return this.storesService.findOne(id, validatedPopulate)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una tienda existente' })
  @ApiParam({
    name: 'id',
    description: 'ID único de la tienda',
    example: '60c754f5-322e-4c67-8cda-388d0e35750c',
  })
  @ApiResponse({ status: 200, description: 'Tienda actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Tienda no encontrada' })
  update(@Param('id') id: string, @Body() data: UpdateStoreDto) {
    return this.storesService.update(id, data)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una tienda' })
  @ApiParam({
    name: 'id',
    description: 'ID único de la tienda',
    example: '60c754f5-322e-4c67-8cda-388d0e35750c',
  })
  @ApiResponse({ status: 200, description: 'Tienda eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Tienda no encontrada' })
  remove(@Param('id') id: string) {
    return this.storesService.remove(id)
  }
}
