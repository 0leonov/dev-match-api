import { ApiPropertyOptions } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';

import { Role } from '../../enums';

export function ApiPropertyRole(options?: ApiPropertyOptions) {
  return ApiProperty({
    required: false,
    type: Role,
    isArray: true,
    enum: Role,
    example: [Role.USER, Role.ADMIN],
    ...options,
  });
}
