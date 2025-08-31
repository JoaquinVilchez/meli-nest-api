import { Module } from '@nestjs/common'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CategoriesModule } from './categories/categories.module'
import { ReviewsModule } from './reviews/reviews.module'
import { StoresModule } from './stores/stores.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [CategoriesModule, StoresModule, ReviewsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
