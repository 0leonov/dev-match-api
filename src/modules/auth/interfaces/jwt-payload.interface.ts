import { Role } from '../../../common/enums';

export interface JwtPayload {
  sub: string;
  roles: Role[];
}
