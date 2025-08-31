// src/interceptors/populate.interceptor.ts
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'

import { RequestPopulate } from '../../types/request-populate.type'

export interface PopulateOptions {
  validOptions: string[]
}

@Injectable()
export class PopulateInterceptor implements NestInterceptor {
  constructor(private options: PopulateOptions) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp()
    const request = ctx.getRequest<RequestPopulate>()
    const populate = request.query.populate

    if (populate) {
      try {
        const parsed = JSON.parse(populate) as string[]

        if (!Array.isArray(parsed)) {
          throw new BadRequestException('Populate must be an array')
        }

        for (const item of parsed) {
          if (!this.options.validOptions.includes(item)) {
            throw new BadRequestException(
              `Invalid populate option: ${item}. Valid options are: ${this.options.validOptions.join(', ')}`,
            )
          }
        }

        request.validatedPopulate = parsed
      } catch (error) {
        if (error instanceof BadRequestException) {
          throw error
        }
        throw new BadRequestException('Invalid populate format')
      }
    }

    return next.handle()
  }
}
