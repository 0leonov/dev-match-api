import { ApiProperty } from '@nestjs/swagger';

export class TokensResponse {
  @ApiProperty({
    type: String,
  })
  accessToken: string;
}
