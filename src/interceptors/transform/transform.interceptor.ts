import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

export interface ApiResponseDto<T> {
  success: boolean
  message: string
  data?: T
  errors?: string[]
  statusCode?: number
}

export interface PaginationDto {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ServiceResponseDto<T> {
  message: string
  data?: T
  pagination?: PaginationDto
}

export interface HttpError {
  message?: string
  status?: number
  errors?: string[]
  response?: {
    message: string | string[]
  }
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponseDto<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponseDto<T>> {
    const ctx = context.switchToHttp()
    const request = ctx.getRequest<{ method: string }>()

    return next.handle().pipe(
      map((data: unknown): ApiResponseDto<T> => {
        if (data && typeof data === 'object' && 'success' in data) {
          return data as ApiResponseDto<T>
        }

        if (data && typeof data === 'object' && 'message' in data) {
          const serviceResponse = data as ServiceResponseDto<T>
          return {
            success: true,
            message: serviceResponse.message,
            data: serviceResponse.data,
          }
        }

        let message = 'Success'
        switch (request.method) {
          case 'POST':
            message = 'Resource created successfully'
            break
          case 'GET':
            message =
              Array.isArray(data) && data.length === 0
                ? 'No resources found'
                : 'Resources retrieved successfully'
            break
          case 'PUT':
          case 'PATCH':
            message = 'Resource updated successfully'
            break
          case 'DELETE':
            message = 'Resource deleted successfully'
            break
        }

        return {
          success: true,
          message,
          data: data as T,
        }
      }),
      catchError((error: HttpError): Observable<ApiResponseDto<T>> => {
        const errorResponse: ApiResponseDto<T> = {
          success: false,
          message: error.message || 'Internal server error',
          errors: error.errors || [error.message || 'Unknown error'],
        }

        if (error.status) {
          errorResponse.statusCode = error.status
        }

        if (error.response && Array.isArray(error.response.message)) {
          errorResponse.errors = error.response.message
        }

        return of(errorResponse)
      }),
    )
  }
}
