// src/interfaces/agent-task.interface.ts
export type TaskType = 'pipeline' | 'ansible' | 'terraform';

export interface AgentTask {
  id: string;
  agentId: string;
  type: TaskType;
  payload: any;
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  createdAt: number;
  updatedAt: number;
  requestedBy: string;
}
