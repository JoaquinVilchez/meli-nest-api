import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common'

import { ValidatePopulate } from '../decorators/populate/populate.decorator'
import { RequestPopulate } from '../types/request-populate.type'
import { PRODUCTS_POPULATE_OPTIONS } from '../utils/constants.util'

import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { ProductsService } from './products.service'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() data: CreateProductDto) {
    return this.productsService.create(data)
  }

  @Get()
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
  @ValidatePopulate(Object.values(PRODUCTS_POPULATE_OPTIONS))
  findOne(@Param('id') id: string, @Req() request: RequestPopulate) {
    const validatedPopulate = (request.validatedPopulate ||
      []) as (typeof PRODUCTS_POPULATE_OPTIONS)[number][]

    return this.productsService.findOne(id, validatedPopulate)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateProductDto) {
    return this.productsService.update(id, data)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id)
  }
}
