import { ApiProperty } from '@nestjs/swagger';

import { FullUserDto } from '../../../common/dto';

export class AuthenticatedUserDto {
  @ApiProperty({
    type: String,
  })
  accessToken: string;

  @ApiProperty({
    type: FullUserDto,
  })
  user: FullUserDto;
}
