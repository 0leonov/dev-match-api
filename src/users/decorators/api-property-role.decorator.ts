import { ApiPropertyOptions } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';

import { UserRole } from '../enums/user-role.enum';

export function ApiPropertyRole(options?: ApiPropertyOptions) {
  return ApiProperty({
    required: false,
    type: UserRole,
    isArray: true,
    enum: UserRole,
    example: [UserRole.USER, UserRole.ADMIN],
    ...options,
  });
}
