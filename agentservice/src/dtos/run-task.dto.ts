// src/dtos/run-task.dto.ts
import { IsEnum, IsObject, IsString } from 'class-validator';
import type { TaskType } from '../interfaces/agent-task.interface';

export class RunTaskDto {
  @IsString()
  agentId: string;

  @IsEnum(['pipeline', 'ansible', 'terraform'] as any)
  taskType: TaskType;

  @IsObject()
  payload: any;

  @IsString()
  requestedBy: string;
}
