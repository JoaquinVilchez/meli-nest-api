import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { TransformInterceptor } from './interceptors/transform/transform.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )

  app.useGlobalInterceptors(new TransformInterceptor())

  await app.listen(process.env.PORT ?? 3000)
}

bootstrap().catch(error => {
  console.error('Failed to start application:', error)
  process.exit(1)
})
