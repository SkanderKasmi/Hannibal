// src/dtos/job/create-job.dto.ts
import { IsString } from 'class-validator';

export class CreateJobDto {
  @IsString()
  pipelineId: string;

  @IsString()
  startedBy: string;
}
