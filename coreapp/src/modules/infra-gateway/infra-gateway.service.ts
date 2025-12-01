



import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthGatewayService } from '../auth-gateway/auth-gateway.service';


@Injectable()
export class InfraGatewayService {
  constructor(
    @Inject('INFRA_SERVICE') private readonly infraClient: ClientProxy,
    private readonly authGateway: AuthGatewayService,
  ) {}

  async listResourceGroups(userId: string) {
    const allowed = await this.authGateway.checkPermission(
      userId,
      'LIST',
      'RESOURCE_GROUP',
      '*',
    );
    if (!allowed) throw new ForbiddenException('No access');

    const res$ = this.infraClient.send(
      { cmd: 'infra.listResourceGroups' },
      {},
    );
    return firstValueFrom(res$);
  }

  async getResourceGroupById(userId: string, rgId: string) {
    const allowed = await this.authGateway.checkPermission(
      userId,
      'READ',
      'RESOURCE_GROUP',
      rgId,
    );
    if (!allowed) throw new ForbiddenException('No access');

    const res$ = this.infraClient.send(
      { cmd: 'infra.getResourceGroupById' },
      { id: rgId },
    );
    return firstValueFrom(res$);
  }

  async getVmById(userId: string, vmId: string) {
    const allowed = await this.authGateway.checkPermission(
      userId,
      'READ',
      'VM',
      vmId,
    );
    if (!allowed) throw new ForbiddenException('No access');

    const res$ = this.infraClient.send({ cmd: 'infra.getVmById' }, { id: vmId });
    return firstValueFrom(res$);
  }
}