// src/dtos/pipeline/create-pipeline.dto.ts
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { TaskType } from '../../entities/task.entity';

export class CreateTaskInputDto {
  @IsString()
  name: string;

  @IsEnum(['shell', 'ansible', 'terraform'] as const)
  type: TaskType;

  @IsInt()
  orderIndex: number;

  @IsString()
  command: string;

  @IsOptional()
  @IsString()
  vmId?: string;
}

export class CreatePipelineDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTaskInputDto)
  tasks: CreateTaskInputDto[];
}

export class RunPipelineDto {
  @IsString()
  pipelineId: string;

  @IsOptional()
  @IsString()
  startedBy?: string;
}
