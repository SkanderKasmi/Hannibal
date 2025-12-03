// src/dtos/job/job-result.dto.ts
import { IsString, IsEnum, IsOptional } from 'class-validator';
import type { JobStatus } from '../../entities/job.entity';

export class JobResultDto {
  @IsString()
  jobId: string;

  @IsEnum(['SUCCESS', 'FAILED'] as const)
  status: JobStatus;

  @IsOptional()
  @IsString()
  errorMessage?: string;
}
