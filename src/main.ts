import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { TransformInterceptor } from './interceptors/transform/transform.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('MercadoLibre Challenge API')
    .setDescription('API REST para el desafío técnico de MercadoLibre')
    .setVersion('1.0')
    .addTag('products', 'Gestión de productos')
    .addTag('categories', 'Gestión de categorías')
    .addTag('stores', 'Gestión de tiendas')
    .addTag('users', 'Gestión de usuarios')
    .addTag('reviews', 'Gestión de reseñas')
    .addTag('questions', 'Gestión de preguntas y respuestas')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'API Docs - MercadoLibre Challenge',
    customfavIcon: 'https://s3-symbol-logo.tradingview.com/mercadolibre--big.svg',
  })

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )

  app.useGlobalInterceptors(new TransformInterceptor())

  const port = process.env.PORT ?? 3000
  await app.listen(port)

  console.log(`🚀 Application is running on: http://localhost:${port}`)
  console.log(`📚 Swagger documentation available at: http://localhost:${port}/api`)
}

bootstrap().catch(error => {
  console.error('Failed to start application:', error)
  process.exit(1)
})
