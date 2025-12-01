import { Controller, Get, Param, Query, Sse } from '@nestjs/common';
import { LiveStreamService } from './live-stream.service';
import { GetMetricsDto } from '../../dtos/get-metrics.dto';
import { MetricsValidationPipe } from '../../validation/pipes/metrics-validation.pipe';
import { Observable } from 'rxjs';
import { AggregatedMetric } from '../../interfaces/metrics/aggregated-metric.interface';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly liveStream: LiveStreamService) {}

  @Sse('stream')
  streamMetrics(@Query(MetricsValidationPipe) query: GetMetricsDto): Observable<AggregatedMetric> {
    return this.liveStream.stream(query);
  }

  @Get('latest/:vmId')
  getLatestMetrics(@Param('vmId') vmId: string): AggregatedMetric | undefined {
    return this.liveStream.getLatest(vmId);
  }
}
