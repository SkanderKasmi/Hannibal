// src/interfaces/task.interface.ts
import { TaskType } from '../entities/task.entity';

export interface TaskInterface {
  id: string;
  name: string;
  type: TaskType;
  orderIndex: number;
  command: string;
  vmId?: string;
}
