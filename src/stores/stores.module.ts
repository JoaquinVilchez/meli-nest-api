import { Module } from '@nestjs/common'

import { CategoriesModule } from '../categories/categories.module'

import { StoresController } from './stores.controller'
import { StoresService } from './stores.service'

@Module({
  imports: [CategoriesModule],
  controllers: [StoresController],
  providers: [StoresService],
  exports: [StoresService],
})
export class StoresModule {}
