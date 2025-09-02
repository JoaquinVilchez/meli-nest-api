import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  private readonly startTime = Date.now()

  getAppInfo() {
    return {
      success: true,
      message: 'MercadoLibre Challenge API',
      data: {
        name: 'MercadoLibre Challenge API',
        version: '1.0.0',
        description: 'API REST para el desafío técnico de MercadoLibre',
        endpoints: {
          products: '/products',
          categories: '/categories',
          stores: '/stores',
          users: '/users',
          reviews: '/reviews',
          questions: '/questions',
        },
        documentation: '/api',
      },
    }
  }
}
