
import { Module } from '@nestjs/common';

import { AuthGatewayService } from './auth-gateway.service';
import { RmqClientsModule } from 'src/common/rmq-clients.module';

@Module({
  imports: [RmqClientsModule],
  providers: [AuthGatewayService],
  exports: [AuthGatewayService],
})
export class AuthGatewayModule {}