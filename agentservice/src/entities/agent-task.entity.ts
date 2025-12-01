// src/entities/agent-task.entity.ts
import { AgentTask, TaskType } from '../interfaces/agent-task.interface';

export class AgentTaskEntity implements AgentTask {
  id: string;
  agentId: string;
  type: TaskType;
  payload: any;
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  createdAt: number;
  updatedAt: number;
  requestedBy: string;
}
