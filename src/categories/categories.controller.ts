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

import { TransformInterceptor } from '../interceptors/transform/transform.interceptor'

import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

@UseInterceptors(TransformInterceptor)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto)
  }

  @Get()
  findAll(@Query('limit') limit: number, @Query('page') page: number) {
    return this.categoriesService.findAll(limit, page)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id)
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return await this.categoriesService.update(id, updateCategoryDto)
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Query('cascade') cascade: boolean = false) {
    return await this.categoriesService.remove(id, cascade)
  }
}
