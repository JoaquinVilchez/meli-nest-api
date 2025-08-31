import { Module } from '@nestjs/common'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CategoriesModule } from './categories/categories.module'
import { StoresModule } from './stores/stores.module'

@Module({
  imports: [CategoriesModule, StoresModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
