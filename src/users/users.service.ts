import * as path from 'path'

import { Injectable, NotFoundException } from '@nestjs/common'

import { FilePersistenceUtil } from '../utils/file-persistence.util'

import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
  private readonly usersFileData = path.join(process.cwd(), 'src', 'data', 'users.json')
  private usersData: User[] = []

  private async loadData(): Promise<void> {
    this.usersData = await FilePersistenceUtil.readData<User[]>(this.usersFileData)
  }

  constructor() {
    this.loadData().catch(error => console.error('Failed to load data:', error))
  }

  // User entity is read-only: no create/update/delete methods needed
  // Users are referenced by other entities (reviews, stores) but cannot be modified
  // This is intentional

  findAll(limit?: number, page?: number, pagination: boolean = true) {
    let usersResult: User[]

    if (!pagination) {
      usersResult = this.usersData
      page = null
      limit = null
    } else {
      if (!page) {
        page = 1
      }
      if (!limit) {
        limit = 50
      }
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      usersResult = this.usersData.slice(startIndex, endIndex)
    }

    const total = usersResult.length

    return {
      data: usersResult,
      message: `Retrieved ${total} users`,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  findOne(id: string) {
    const user = this.usersData.find(user => user.id === id)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    return {
      data: user,
      message: 'User found successfully',
    }
  }
}
