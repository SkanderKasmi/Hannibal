// src/modules/rmq/automation-rmq.handler.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrchestrationService } from '../../services/orchestration.service';
import { JobStatus } from '../../entities/job.entity';

@Controller()
export class AutomationRmqHandler {
  constructor(private readonly orchestration: OrchestrationService) {}

  @MessagePattern({ cmd: 'automation.runPipeline' })
  runPipeline(@Payload() payload: { pipelineId: string; startedBy?: string }) {
    return this.orchestration.startJob(payload.pipelineId, payload.startedBy);
  }

  // Called by agent-service when a whole job finishes (optional)
  @MessagePattern({ cmd: 'automation.jobResult' })
  jobResult(
    @Payload()
    payload: { jobId: string; status: JobStatus; errorMessage?: string },
  ) {
    return this.orchestration.updateJobStatus(payload);
  }
}
