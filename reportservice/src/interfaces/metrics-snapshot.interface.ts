// src/interfaces/metrics-snapshot.interface.ts
export interface MetricsSnapshotDto {
  vmId: string;
  resourceGroupId?: string;
  cpuLoad: number;
  memoryUsagePercent: number;
  diskUsedPercent: number;
  networkRx: number;
  networkTx: number;
  os: string;
  timestamp: string; // ISO from MonitorService
}
