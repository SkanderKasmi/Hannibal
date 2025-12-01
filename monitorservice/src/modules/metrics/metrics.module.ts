import { Module } from '@nestjs/common';
import { KafkaConsumerService } from './kafka-consumer.service';
import { DataEngineeringService } from './data-engineering.service';
import { FilteringService } from './filtering.service';
import { CalculationService } from './calculation.service';
import { MetricsStoreService } from './metrics-store.service';
import { LiveStreamService } from './live-stream.service';
import { MetricsController } from './metrics.controller';
import { ReportRpcHandler } from './report-rpc.handler';

@Module({
  providers: [
    KafkaConsumerService,
    DataEngineeringService,
    FilteringService,
    CalculationService,
    MetricsStoreService,
    LiveStreamService,
    ReportRpcHandler,
  ],
  controllers: [MetricsController],
})
export class MetricsModule {}
