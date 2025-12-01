// src/security/session.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../utils/decorators/public.decorator';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) return true;

    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    const user = request.user || request.session?.user;

    if (!user) {
      throw new UnauthorizedException('Not authenticated');
    }

    request.currentUser = user;
    return true;
  }
}
