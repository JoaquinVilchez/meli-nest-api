import { UseInterceptors } from '@nestjs/common'

import { PopulateInterceptor } from '../../interceptors/populate/populate.interceptor'

export function ValidatePopulate(validOptions: string[]) {
  return UseInterceptors(new PopulateInterceptor({ validOptions }))
}
