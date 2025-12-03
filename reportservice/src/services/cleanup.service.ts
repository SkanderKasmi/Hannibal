// src/services/cleanup.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from '../entities/report.entity';
import { Repository, LessThan } from 'typeorm';
import { ReportSettings } from '../settings/report.settings';

@Injectable()
export class CleanupService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepo: Repository<Report>,
  ) {}

  async cleanupOldReports() {
    const cutoff = new Date(
      Date.now() - ReportSettings.RETENTION_DAYS * 24 * 60 * 60 * 1000,
    );
    const oldReports = await this.reportRepo.find({
      where: { createdAt: LessThan(cutoff) },
    });
    // Here you could also delete from MEGA if needed
    await this.reportRepo.remove(oldReports);
    return { deleted: oldReports.length };
  }
}
