import { UserRole } from '../../users/enums/user-role.enum';

export interface JwtPayload {
  sub: string;
  roles: UserRole[];
}
