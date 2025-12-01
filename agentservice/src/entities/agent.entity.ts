// src/entities/agent.entity.ts
import { Agent } from '../interfaces/agent.interface';

export class AgentEntity implements Agent {
  id: string;
  vmId: string;
  vmName: string;
  resourceGroupId: string;
  resourceGroupName: string;
  status: 'DEPLOYING' | 'RUNNING' | 'ERROR';
  lastHeartbeat?: number;
}
