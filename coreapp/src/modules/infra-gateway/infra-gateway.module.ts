
import { Module } from '@nestjs/common';

import { InfraGatewayService } from './infra-gateway.service';
import { InfraController } from './infra.controller';
import { RmqClientsModule } from 'src/common/rmq-clients.module';
import { AuthGatewayModule } from '../auth-gateway/auth-gateway.module';


@Module({
  imports: [RmqClientsModule, AuthGatewayModule],
  providers: [InfraGatewayService],
  controllers: [InfraController],
  exports: [InfraGatewayService],
})
export class InfraGatewayModule {}