// coreapp/src/security/auth-bridge.service.ts
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthBridgeService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}  

  async validateToken(token: string) {
    try {
      const pattern = { cmd: 'auth.validateToken' }; // handled in authservice via RMQ
      const payload = { token };

      const user = await firstValueFrom(
        this.authClient.send(pattern, payload),
      );

      // you will get something like:
      //  { sub, username, role, isAdminToken?: true }
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
