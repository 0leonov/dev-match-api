import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { RefreshToken } from '../../auth/entities/refresh-token.entity';
import { ApiPropertyRole } from '../decorators/api-property-role.decorator';
import { User } from '../entities/user.entity';
import { UserRole } from '../enums/user-role.enum';

export class CurrentUserResponse implements User {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  username: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiPropertyRole({ required: true })
  roles: UserRole[];

  @ApiProperty({ type: String })
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
