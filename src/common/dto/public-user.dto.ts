import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { RefreshToken } from '../../models/entities';
import { UserEntity } from '../../models/entities';
import {
  ApiPropertyGender,
  ApiPropertyInterests,
  ApiPropertyRole,
} from '../decorators';
import { Role, Gender, Interest } from '../enums';

export class PublicUserDto implements UserEntity {
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
