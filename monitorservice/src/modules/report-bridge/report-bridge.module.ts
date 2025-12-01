import { Module } from '@nestjs/common';
import { ReportBridgeService } from './report-bridge.service';

@Module({
  providers: [ReportBridgeService],
  exports: [ReportBridgeService],
})
export class ReportBridgeModule {}
