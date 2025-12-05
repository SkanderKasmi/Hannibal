// src/interfaces/cloud-provider.interface.ts
import { ProviderType } from '../entities/resource-group.entity';

export interface CloudProviderConfig {
  type: ProviderType;
  region?: string;
  accountId?: string;
}
