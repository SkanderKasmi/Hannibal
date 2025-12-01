// src/entities/session.entity.ts
export class SessionEntity {
  id: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
}
