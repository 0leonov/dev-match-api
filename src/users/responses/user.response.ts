import { Exclude } from 'class-transformer';

import { RefreshToken } from '../../auth/entities/refresh-token.entity';
import { UserRole } from '../entities/user-role.enum';
import { User } from '../entities/user.entity';

export class UserResponse implements User {
  id: string;
  username: string;
  name: string;
  roles: UserRole[];

  @Exclude()
  createdAt: Date;

  @Exclude()
  email: string;

  @Exclude()
  password: string;

  @Exclude()
  refreshTokens: RefreshToken[];

  @Exclude()
  updatedAt: Date;

  constructor(user: User) {
    Object.assign(this, user);
  }
}
