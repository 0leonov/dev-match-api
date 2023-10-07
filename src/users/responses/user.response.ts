import { Exclude } from 'class-transformer';

import { RefreshToken } from '../../auth/entities/refresh-token.entity';
import { UserRole } from '../entities/user-role.enum';
import { User } from '../entities/user.entity';

export class UserResponse implements User {
  createdAt: Date;
  email: string;
  id: string;
  name: string;

  @Exclude()
  password: string;

  refreshTokens: RefreshToken[];
  roles: UserRole[];
  updatedAt: Date;
  username: string;

  constructor(user: User) {
    Object.assign(this, user);
  }
}
