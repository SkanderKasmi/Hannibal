export interface CleanMetric {
  vmId: string;
  timestamp: number;
  cpu: number;
  gpu: number;
  ram: number;
  disk: number;
  networkIn: number;
  networkOut: number;
  os: string;
  logs: any[];
  tasks: any[];
}
