// src/interfaces/pipeline.interface.ts
import { Task } from '../entities/task.entity';

export interface PipelineInterface {
  id: string;
  name: string;
  description?: string;
  tasks: Task[];
}
