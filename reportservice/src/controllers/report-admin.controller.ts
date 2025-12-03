// src/controllers/report-admin.controller.ts
import { Controller, Post } from '@nestjs/common';
import { CleanupService } from '../services/cleanup.service';

@Controller('admin/reports')
export class ReportAdminController {
  constructor(private readonly cleanup: CleanupService) {}

  @Post('cleanup')
  cleanupOld() {
    return this.cleanup.cleanupOldReports();
  }
}
