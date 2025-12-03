import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface VmMetadata {
  vmId: string;
  vmName: string;
  resourceGroupId: string;
  resourceGroupName: string;
  ipAddress?: string;
  status?: string;
}

@Injectable()
export class InfraBridgeService {
    private readonly logger = new Logger(InfraBridgeService.name);
    private readonly infraBaseUrl =
    process.env.INFRA_SERVICE_URL || 'http://infraservice:3001';

  constructor(private readonly http: HttpService) {}
  async getVmName(vmId: string): Promise<string> {
    // call InfraService or DB to resolve VM name
    return `VM-${vmId}`;
  }

  async getResourceGroupName(rgId: string): Promise<string> {
    return `RG-${rgId}`;
  }
  async getVmMetadata(vmId: string): Promise<VmMetadata> {
    try {
      // Adjust this path to match your Infra service API (Nest infraservice)
      // For example if you have:
      //   GET /vms/:id  → returns { id, name, ipAddress, status, resourceGroup: { id, name } }
      const url = `${this.infraBaseUrl}/vms/${vmId}`;

      const { data } = await firstValueFrom(this.http.get(url));

      // Normalize response into a stable VmMetadata shape
      return {
        vmId: data.id || data.vmId || vmId,
        vmName: data.name || data.vmName,
        resourceGroupId:
          data.resourceGroup?.id ||
          data.resourceGroupId ||
          data.rgId,
        resourceGroupName:
          data.resourceGroup?.name ||
          data.resourceGroupName ||
          data.rgName,
        ipAddress: data.ipAddress,
        status: data.status,
      };
    } catch (err) {
      this.logger.error(
        `Failed to fetch VM metadata for ${vmId} from Infra service`,
        (err as any).stack,
      );
      throw err;
    }
  }
}
