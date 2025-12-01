// src/entities/user.entity.ts
export class UserEntity {
  id: string;
  username: string;
  email?: string;
  roles: string[];
}
