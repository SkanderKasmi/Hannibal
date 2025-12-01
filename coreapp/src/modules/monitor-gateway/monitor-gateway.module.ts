import { Module } from '@nestjs/common';

import { MonitorGatewayService } from './monitor-gateway.service';
import { MonitorController } from './monitor.controller';
import { RmqClientsModule } from 'src/common/rmq-clients.module';

@Module({
  imports: [RmqClientsModule],
  providers: [MonitorGatewayService],
  controllers: [MonitorController],
  exports: [MonitorGatewayService],
})
export class MonitorGatewayModule {}