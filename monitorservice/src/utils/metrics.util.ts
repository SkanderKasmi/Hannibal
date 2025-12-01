export interface RawMetric {
  vmId: string;
  resourceGroupId: string;
  timestamp: string;
  cpuLoad: number;
  memUsed: number;
  memTotal: number;
  diskUsedPercent: number;
}
