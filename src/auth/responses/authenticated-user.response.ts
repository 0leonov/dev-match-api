import { ApiProperty } from '@nestjs/swagger';

import { CurrentUserResponse } from '../../users/responses/current-user.response';

export class AuthenticatedUserResponse {
  @ApiProperty({
    type: String,
  })
  accessToken: string;

  @ApiProperty({
    type: CurrentUserResponse,
  })
  user: CurrentUserResponse;
}
