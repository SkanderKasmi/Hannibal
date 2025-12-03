import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // TODO: call Auth service (check session/JWT & access rights)
    return true; // allow during dev
  }
}
