import { Injectable, Logger } from '@nestjs/common';
import { RawMetric } from '../../interfaces/metrics/raw-metric.interface';
import { CleanMetric } from '../../interfaces/metrics/clean-metric.interface';

@Injectable()
export class FilteringService {
  private readonly logger = new Logger(FilteringService.name);

  /**
   * Cleans raw metric values, removing invalid or out-of-range data
   */
  clean(raw: RawMetric): CleanMetric {
    const cleanMetric: CleanMetric = {
      vmId: raw.vmId,
      timestamp: raw.timestamp,
      cpu: this.validatePercentage(raw.cpu),
      gpu: this.validatePercentage(raw.gpu),
      ram: this.validatePercentage(raw.ram),
      disk: this.validatePercentage(raw.disk),
      networkIn: this.validateNonNegative(raw.networkIn),
      networkOut: this.validateNonNegative(raw.networkOut),
      os: raw.os || 'unknown',
      logs: Array.isArray(raw.logs) ? raw.logs : [],
      tasks: Array.isArray(raw.tasks) ? raw.tasks : [],
    };

    return cleanMetric;
  }

  private validatePercentage(value: number): number {
    if (typeof value !== 'number' || value < 0) return 0;
    if (value > 100) return 100;
    return Math.round(value * 100) / 100; // round to 2 decimals
  }

  private validateNonNegative(value: number): number {
    if (typeof value !== 'number' || value < 0) return 0;
    return value;
  }
}
