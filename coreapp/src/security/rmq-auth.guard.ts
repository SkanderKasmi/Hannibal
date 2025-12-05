// coreapp/src/security/rmq-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthBridgeService } from 'src/modules/auth-gateway/auth-bridge.service';


@Injectable()
export class RmqAuthGuard implements CanActivate {
  constructor(private readonly authBridge: AuthBridgeService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const type = context.getType<'http' | 'rpc' | 'ws'>();

    if (type === 'http') {
      const req = context.switchToHttp().getRequest();
      const authHeader =
        (req.headers['authorization'] || req.headers['Authorization']) as
          | string
          | undefined;

      if (!authHeader) {
        throw new UnauthorizedException('Missing Authorization header');
      }

      const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : authHeader;

      if (!token) {
        throw new UnauthorizedException('Missing token');
      }

      const user = await this.authBridge.validateToken(token);
      req.user = user; // 👑 includes admin info if token = ADMIN_TOKEN in authservice

      return true;
    }

    // If you later need RPC guard, you can handle it here too.
    return true;
  }
}
