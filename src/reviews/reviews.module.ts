import { forwardRef, Module } from '@nestjs/common'

import { ProductsModule } from '../products/products.module'
import { StoresModule } from '../stores/stores.module'
import { UsersModule } from '../users/users.module'

import { ReviewsController } from './reviews.controller'
import { ReviewsService } from './reviews.service'

@Module({
  imports: [UsersModule, forwardRef(() => ProductsModule), StoresModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
