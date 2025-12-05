/* eslint-disable @typescript-eslint/no-redundant-type-constituents */


import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthGatewayService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  async checkPermission(
    userId: string,
    action: string,
    resourceType: 'VM' | 'RESOURCE_GROUP' | 'AGENT' | string,
    resourceId: string,
  ): Promise<boolean> {
    const res$ = this.authClient.send(
      { cmd: 'auth.checkPermission' },
      { userId, action, resourceType, resourceId },
    );
    const result = await firstValueFrom(res$);
    return !!result?.allowed;
  }
  
}