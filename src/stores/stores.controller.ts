import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common'

import { ValidatePopulate } from '../decorators/populate/populate.decorator'
import { RequestPopulate } from '../types/request-populate.type'
import { ENTITY_NAMES } from '../utils/constants.util'

import { CreateStoreDto } from './dto/create-store.dto'
import { UpdateStoreDto } from './dto/update-store.dto'
import { StoresService } from './stores.service'

const POPULATE_OPTIONS = {
  CATEGORIES: ENTITY_NAMES.CATEGORIES,
} as const

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.create(createStoreDto)
  }

  @Get()
  @ValidatePopulate(Object.values(POPULATE_OPTIONS))
  findAll(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Req() request: RequestPopulate,
  ) {
    const validatedPopulate = (request.validatedPopulate ||
      []) as (typeof POPULATE_OPTIONS)[keyof typeof POPULATE_OPTIONS][]

    return this.storesService.findAll(limit, page, validatedPopulate)
  }

  @Get(':id')
  @ValidatePopulate(Object.values(POPULATE_OPTIONS))
  findOne(@Param('id') id: string, @Req() request: RequestPopulate) {
    const validatedPopulate = (request.validatedPopulate ||
      []) as (typeof POPULATE_OPTIONS)[keyof typeof POPULATE_OPTIONS][]

    return this.storesService.findOne(id, validatedPopulate)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storesService.update(id, updateStoreDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storesService.remove(id)
  }
}
