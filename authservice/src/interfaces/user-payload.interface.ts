import { UserRole } from '../entities/user.entity';

export interface UserPayload {
  sub: string;
  username: string;
  role: UserRole;
}
