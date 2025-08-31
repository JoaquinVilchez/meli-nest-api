import { Controller, Get, Query } from '@nestjs/common'

import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('pagination') pagination: boolean = true,
  ) {
    return this.usersService.findAll(limit, page, pagination)
  }
}
