import { forwardRef, Module } from '@nestjs/common'

import { CategoriesModule } from '../categories/categories.module'
import { ReviewsModule } from '../reviews/reviews.module'
import { StoresModule } from '../stores/stores.module'

import { ProductsController } from './products.controller'
import { ProductsService } from './products.service'

@Module({
  imports: [forwardRef(() => ReviewsModule), CategoriesModule, StoresModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
