// src/alert/report-alert.service.ts
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ReportAlertService {
  private readonly logger = new Logger(ReportAlertService.name);

  async notifyFailure(reason: string) {
    this.logger.warn(`Report generation/upload failed: ${reason}`);
    // TODO integrate email/Slack/webhook
  }
}
