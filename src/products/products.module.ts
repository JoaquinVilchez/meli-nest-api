import { Module } from '@nestjs/common'

import { AggregationModule } from '../aggregation/aggregation.module'
import { CategoriesModule } from '../categories/categories.module'
import { StoresModule } from '../stores/stores.module'

import { ProductsController } from './products.controller'
import { ProductsService } from './products.service'

@Module({
  imports: [CategoriesModule, StoresModule, AggregationModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
