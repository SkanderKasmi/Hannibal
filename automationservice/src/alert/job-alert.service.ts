// src/alert/job-alert.service.ts
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class JobAlertService {
  private readonly logger = new Logger(JobAlertService.name);

  async notifyJobFailure(jobId: string, reason: string) {
    this.logger.warn(`Job ${jobId} failed: ${reason}`);
    // TODO: send email/Slack/webhook, etc.
  }
}
