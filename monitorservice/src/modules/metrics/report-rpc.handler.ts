import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { MetricsStoreService } from './metrics-store.service';
import { AggregatedMetric } from '../../interfaces/metrics/aggregated-metric.interface';

@Controller()
export class ReportRpcHandler {
  constructor(private readonly store: MetricsStoreService) {}

  @MessagePattern('metrics.snapshotForReport')
  async handleSnapshot(@Payload() data: { vmId: string; limit?: number }, @Ctx() context: RmqContext) {
    const vmId = data.vmId;
    const limit = data.limit || 50;
    const metrics: AggregatedMetric[] = await this.store.getRecent(vmId, limit);
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
    return metrics;
  }
}
