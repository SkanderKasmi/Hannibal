import {
  Controller,
  Get,
  Param,
  Query,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LiveStreamService } from '../modules/metrics/live-stream.service';
import { MetricsStoreService } from '../modules/metrics/metrics-store.service';
import { InfraBridgeService } from '../modules/infra-bridge/infra-bridge.service';
import { ReportBridgeService } from '../modules/report-bridge/report-bridge.service';
import { AggregatedMetric } from '../interfaces/metrics/aggregated-metric.interface';
import { GenerateReportDto } from '../dtos/generate-report.dto';

@Controller('monitor')
export class MonitorController {
  constructor(
    private readonly liveStream: LiveStreamService,
    private readonly metricsStore: MetricsStoreService,
    private readonly infraBridge: InfraBridgeService,
    private readonly reportBridge: ReportBridgeService,
  ) {}

  // --- SSE endpoint for live streaming metrics for a VM ---
  @Sse('stream')
  streamMetrics(@Query('vmId') vmId?: string): Observable<MessageEvent> {
    // Stream metrics filtered by vmId if provided
    return this.liveStream.stream({ vmId }).pipe(
      map((metric: AggregatedMetric) => ({
        data: metric,
      })),
    );
  }

  // --- Get latest metric for a VM (REST) ---
  @Get('latest/:vmId')
  async getLatest(@Param('vmId') vmId: string) {
    const metric = await this.metricsStore.getLatest(vmId);
    if (!metric) return { message: 'No metrics found for this VM' };

    // Enrich with VM and Resource Group names from Infra
    const metadata = await (this.infraBridge as any).getVmMetadata(vmId);
    return {
      ...metric,
      vmName: metadata.vmName,
      resourceGroupName: metadata.resourceGroupName,
    };
  }

  // --- Get all metrics for a VM ---
  @Get('all/:vmId')
  async getAll(@Param('vmId') vmId: string) {
    const metrics = await this.metricsStore.getAll(vmId);
    const metadata = await this.infraBridge.getVmMetadata(vmId);
    return metrics.map((m) => ({
      ...m,
      vmName: metadata.vmName,
      resourceGroupName: metadata.resourceGroupName,
    }));
  }

  // --- Generate report for VM or Resource Group ---
  @Get('report')
  async generateReport(@Query() dto: GenerateReportDto) {
    // dto: { vmId?: string, resourceGroupId?: string, from: string, to: string, type: 'pdf'|'excel' }
    const reportUrl = await this.reportBridge.generateReport(dto);
    return {
      message: 'Report generated successfully',
      url: reportUrl,
    };
  }
}
