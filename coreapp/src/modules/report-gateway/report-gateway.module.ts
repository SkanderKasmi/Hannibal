// src/report/report-gateway.module.ts
import { Module } from '@nestjs/common';

import { ReportGatewayService } from './report-gateway.service';
import { ReportController } from './report.controller';
import { AuthGatewayModule } from 'src/modules/auth-gateway/auth-gateway.module';
import { RmqClientsModule } from 'src/common/rmq-clients.module';

@Module({
  imports: [RmqClientsModule, AuthGatewayModule],
  providers: [ReportGatewayService],
  controllers: [ReportController],
  exports: [ReportGatewayService],
})
export class ReportGatewayModule {}
