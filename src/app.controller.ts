import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { AppService } from './app.service'

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Información general de la API',
    description:
      'Endpoint principal que proporciona información sobre la API de MercadoLibre Challenge',
  })
  @ApiResponse({
    status: 200,
    description: 'Información de la API obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'MercadoLibre Challenge API' },
        data: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'MercadoLibre Challenge API' },
            version: { type: 'string', example: '1.0.0' },
            description: {
              type: 'string',
              example: 'API REST para el desafío técnico de MercadoLibre',
            },
            endpoints: {
              type: 'object',
              properties: {
                products: { type: 'string', example: '/products' },
                categories: { type: 'string', example: '/categories' },
                stores: { type: 'string', example: '/stores' },
                users: { type: 'string', example: '/users' },
              },
            },
            documentation: { type: 'string', example: '/api' },
          },
        },
      },
    },
  })
  getAppInfo() {
    return this.appService.getAppInfo()
  }
}
