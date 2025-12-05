// src/services/cloud-sync.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ProviderType } from '../entities/resource-group.entity';

@Injectable()
export class CloudSyncService {
  private readonly logger = new Logger(CloudSyncService.name);

  async syncResourceGroup(id: string, provider: ProviderType) {
    this.logger.log(`Sync RG ${id} with provider ${provider}`);
    // TODO: AWS/GCP/Azure APIs
  }
}
