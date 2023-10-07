import { UserRole } from '../users/entities/user-role.enum';

export interface JwtPayload {
  sub: string;
  roles: UserRole[];
}
