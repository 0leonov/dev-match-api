import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { UserEntity } from '../../models/entities';
import { RefreshToken } from '../../models/entities';
import {
  ApiPropertyRole,
  ApiPropertyGender,
  ApiPropertyInterests,
} from '../decorators';
import { Role, Gender, Interest } from '../enums';

export class FullUserDto implements UserEntity {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  username: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String, required: false })
  avatar_url: string;

  @ApiPropertyRole({ required: true })
  roles: Role[];

  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String })
  biography: string;

  @ApiPropertyGender({ required: true })
  gender: Gender;

  @ApiPropertyInterests({ required: true })
  interests: Interest[];

  @Exclude()
  createdAt: Date;

  @Exclude()
  password: string;

  @Exclude()
  refreshTokens: RefreshToken[];

  @Exclude()
  updatedAt: Date;
}
