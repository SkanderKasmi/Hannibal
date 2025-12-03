// src/modules/report/report.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from '../../entities/report.entity';
import { Repository } from 'typeorm';
import { GenerateReportDto } from '../../dtos/generate-report.dto';
import { MetricsSnapshotDto } from '../../interfaces/metrics-snapshot.interface';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { monitorClientOptions } from '../../config/rmq.config';
import { ReportBuilderService } from './report-builder.service';
import { MegaStorageService } from '../storage/mega-storage.service';
import { ReportAlertService } from '../../alert/report-alert.service';
import { buildReportFilename } from '../../utils/filename.util';
import { ReportSettings } from '../../settings/report.settings';

@Injectable()
export class ReportService {
  private monitorClient: ClientProxy;

  constructor(
    @InjectRepository(Report)
    private readonly reportRepo: Repository<Report>,
    private readonly builder: ReportBuilderService,
    private readonly storage: MegaStorageService,
    private readonly alerts: ReportAlertService,
  ) {
    this.monitorClient = ClientProxyFactory.create(monitorClientOptions);
  }

  async generate(dto: GenerateReportDto) {
    const from = new Date(dto.from);
    const to = new Date(dto.to);
    const format = dto.format || ReportSettings.DEFAULT_FORMAT;

    const targetType = dto.vmId ? 'VM' : 'RESOURCE_GROUP';

    // Ask MonitorService for snapshots
    const metrics: MetricsSnapshotDto[] = await this.fetchMetricsFromMonitor(
      dto,
    );

    // TODO: you can also call InfraService to resolve vmName / rgName
    const filename = buildReportFilename({
      vmId: dto.vmId,
      resourceGroupId: dto.resourceGroupId,
      from,
      to,
      format,
    });

    let buffer: Buffer;
    if (format === 'pdf') {
      buffer = await this.builder.buildPdfReport({
        title: `${ReportSettings.TITLE_PREFIX} (${targetType})`,
        from,
        to,
        metrics,
      });
    } else {
      buffer = await this.builder.buildExcelReport({
        title: `${ReportSettings.TITLE_PREFIX} (${targetType})`,
        from,
        to,
        metrics,
      });
    }

    const url = await this.storage.uploadReport(filename, buffer);

    const report = this.reportRepo.create({
      format,
      targetType: targetType as any,
      vmId: dto.vmId,
      resourceGroupId: dto.resourceGroupId,
      from,
      to,
      filename,
      url,
      meta: { count: metrics.length },
    });
    const saved = await this.reportRepo.save(report);

    return saved;
  }

  async list() {
    return this.reportRepo.find({
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  async get(id: string) {
    return this.reportRepo.findOne({ where: { id } });
  }

  private async fetchMetricsFromMonitor(
    dto: GenerateReportDto,
  ): Promise<MetricsSnapshotDto[]> {
    const pattern = { cmd: 'metrics.snapshotForReport' };
    const payload: any = {
      from: dto.from,
      to: dto.to,
    };
    if (dto.vmId) payload.vmId = dto.vmId;
    if (dto.resourceGroupId) payload.resourceGroupId = dto.resourceGroupId;

    const result = await this.monitorClient.send<MetricsSnapshotDto[]>(pattern, payload).toPromise();
    return result ?? [];
  }
}
