import { ApiPropertyOptions } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';

import { Interest } from '../../enums';

export function ApiPropertyInterests(options?: ApiPropertyOptions) {
  return ApiProperty({
    required: false,
    type: Interest,
    isArray: true,
    enum: Interest,
    example: [Interest.KNOWLEDGE, Interest.PROJECT],
    ...options,
  });
}
