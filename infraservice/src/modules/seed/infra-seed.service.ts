// src/modules/seed/infra-seed.service.ts
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ResourceGroupService } from '../resource-group/resource-group.service';

@Injectable()
export class InfraSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(InfraSeedService.name);

  constructor(private readonly rgService: ResourceGroupService) {}

  async onApplicationBootstrap() {
    const existing = await this.rgService.findAll();
    if (existing.length === 0) {
      this.logger.log('Seeding default ResourceGroup...');
      await this.rgService.create({
        name: 'default-rg',
        description: 'Default local resource group',
        providerType: 'LOCAL',
      } as any);
    }
  }
}
