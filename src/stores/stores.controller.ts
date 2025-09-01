import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common'

import { ValidatePopulate } from '../decorators/populate/populate.decorator'
import { RequestPopulate } from '../types/request-populate.type'
import { STORES_POPULATE_OPTIONS } from '../utils/constants.util'

import { CreateStoreDto } from './dto/create-store.dto'
import { UpdateStoreDto } from './dto/update-store.dto'
import { StoresService } from './stores.service'

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  create(@Body() data: CreateStoreDto) {
    return this.storesService.create(data)
  }

  @Get()
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
  @ValidatePopulate(Object.values(STORES_POPULATE_OPTIONS))
  findOne(@Param('id') id: string, @Req() request: RequestPopulate) {
    const validatedPopulate = (request.validatedPopulate ||
      []) as (typeof STORES_POPULATE_OPTIONS)[number][]

    return this.storesService.findOne(id, validatedPopulate)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateStoreDto) {
    return this.storesService.update(id, data)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storesService.remove(id)
  }
}
