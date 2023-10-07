import { UserRole } from '../users/entities/user-role.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  roles: UserRole[];
}
