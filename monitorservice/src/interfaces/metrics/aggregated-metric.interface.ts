import { CleanMetric } from './clean-metric.interface';

export interface AggregatedMetric {
  vmId: string;
  timestamp: number;
  cpuAvg: number;
  gpuAvg: number;
  ramAvg: number;
  diskAvg: number;
  networkInAvg: number;
  networkOutAvg: number;
  totalLogs: number;
  totalTasks: number;
}
