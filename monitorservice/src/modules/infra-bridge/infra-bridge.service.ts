import { Injectable } from '@nestjs/common';

@Injectable()
export class InfraBridgeService {
  async getVmName(vmId: string): Promise<string> {
    // call InfraService or DB to resolve VM name
    return `VM-${vmId}`;
  }

  async getResourceGroupName(rgId: string): Promise<string> {
    return `RG-${rgId}`;
  }
}
