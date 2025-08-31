import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common'

import { ValidatePopulate } from '../decorators/populate/populate.decorator'
import { RequestPopulate } from '../types/request-populate.type'
import { REVIEWS_POPULATE_OPTIONS } from '../utils/constants.util'

import { CreateReviewDto } from './dto/create-review.dto'
import { UpdateReviewDto } from './dto/update-review.dto'
import { ReviewsService } from './reviews.service'

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Body() data: CreateReviewDto) {
    return this.reviewsService.create(data)
  }

  @Get()
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
  @ValidatePopulate(Object.values(REVIEWS_POPULATE_OPTIONS))
  findOne(@Param('id') id: string, @Req() request: RequestPopulate) {
    const validatedPopulate = (request.validatedPopulate ||
      []) as (typeof REVIEWS_POPULATE_OPTIONS)[number][]

    return this.reviewsService.findOne(id, validatedPopulate)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(id, updateReviewDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id)
  }
}
