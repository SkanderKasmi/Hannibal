// src/utils/cloud-provider.util.ts
import { ProviderType } from '../entities/resource-group.entity';

export class CloudProviderUtil {
  static describeProvider(provider: ProviderType): string {
    switch (provider) {
      case 'AWS':
        return 'Amazon Web Services';
      case 'GCP':
        return 'Google Cloud Platform';
      case 'AZURE':
        return 'Microsoft Azure';
      default:
        return 'Local Datacenter';
    }
  }
}
