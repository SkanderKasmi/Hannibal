// src/alert/infra-alert.service.ts
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class InfraAlertService {
  private readonly logger = new Logger(InfraAlertService.name);

  async notifyProvisionFailure(vmName: string, reason: string) {
    this.logger.warn(`Provisioning failed on VM "${vmName}": ${reason}`);
  }
}
