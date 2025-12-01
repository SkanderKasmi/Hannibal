// src/security/auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // TODO: call Auth service (JWT/session) and check permissions per resourceGroup/pipeline
    // For now: allow all for dev
    return true;
  }
}
