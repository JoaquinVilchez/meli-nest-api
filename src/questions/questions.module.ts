import { Module } from '@nestjs/common'

import { ProductsModule } from '../products/products.module'
import { UsersModule } from '../users/users.module'

import { QuestionsController } from './questions.controller'
import { QuestionsService } from './questions.service'

@Module({
  imports: [UsersModule, ProductsModule],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
