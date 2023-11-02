import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { RefreshToken } from '../../auth/entities/refresh-token.entity';
import {
  ApiPropertyRole,
  ApiPropertyGender,
  ApiPropertyInterests,
} from '../decorators/swagger';
import { User } from '../entities';
import { Role, Gender, Interest } from '../enums';

export class UserResponse implements User {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  username: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  avatar_url: string;

  @ApiPropertyRole({ required: true })
  roles: Role[];

  @ApiProperty({ type: String })
  biography: string;

  @ApiPropertyGender({ required: true })
  gender: Gender;

  @ApiPropertyInterests({ required: true })
  interests: Interest[];

  @Exclude()
  email: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  password: string;

  @Exclude()
  refreshTokens: RefreshToken[];

  @Exclude()
  updatedAt: Date;
}
