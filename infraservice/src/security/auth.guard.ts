// src/security/auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // For now, allow everything. Later call auth microservice / validate JWT
    return true;
  }
}
