/* eslint-disable @typescript-eslint/require-await */
// src/alert/alert.service.ts
import { Injectable } from '@nestjs/common';
import { CoreLogger } from '../utils/logger.util';

@Injectable()
export class AlertService {
  async sendAlert(subject: string, message: string) {
    // later: integrate email/slack/etc
    CoreLogger.warn(`[ALERT] ${subject}: ${message}`);
  }
}
