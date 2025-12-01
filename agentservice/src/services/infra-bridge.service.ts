// src/services/infra-bridge.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { VmMetadata } from '../interfaces/vm-metadata.interface';

@Injectable()
export class InfraBridgeService {
  constructor(
    @Inject('INFRA_SERVICE') private readonly infraClient: ClientProxy,
  ) {}

  async getResourceGroupWithVms(resourceGroupId: string): Promise<{
    id: string;
    name: string;
    vms: VmMetadata[];
  }> {
    const res$ = this.infraClient.send(
      { cmd: 'infra.getResourceGroupWithVms' },
      { id: resourceGroupId },
    );
    return firstValueFrom(res$);
  }

  async getVmById(vmId: string): Promise<VmMetadata> {
    const res$ = this.infraClient.send(
      { cmd: 'infra.getVmById' },
      { id: vmId },
    );
    return firstValueFrom(res$);
  }
}
