import { ApiPropertyOptions } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';

import { Gender } from '../../enums';

export function ApiPropertyGender(options?: ApiPropertyOptions) {
  return ApiProperty({
    required: false,
    type: Gender,
    enum: Gender,
    example: Gender.UNKNOWN,
    ...options,
  });
}
