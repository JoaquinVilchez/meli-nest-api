import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'

import { UsersService } from './users.service'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener lista de usuarios con paginación' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Número de elementos por página',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número de página',
    example: 1,
  })
  @ApiQuery({
    name: 'pagination',
    required: false,
    description: 'Habilitar paginación',
    example: true,
  })
  @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida exitosamente' })
  findAll(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('pagination') pagination: boolean = true,
  ) {
    return this.usersService.findAll(limit, page, pagination)
  }
}
