// src/interfaces/job.interface.ts
import { JobStatus } from '../entities/job.entity';

export interface JobInterface {
  id: string;
  pipelineId: string;
  status: JobStatus;
  errorMessage?: string;
}
