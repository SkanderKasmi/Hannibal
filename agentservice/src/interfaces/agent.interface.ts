// src/interfaces/agent.interface.ts
export interface Agent {
  id: string;
  vmId: string;
  vmName: string;
  resourceGroupId: string;
  resourceGroupName: string;
  status: 'DEPLOYING' | 'RUNNING' | 'ERROR';
  lastHeartbeat?: number;
}
