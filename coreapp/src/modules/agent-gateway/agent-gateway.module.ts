
// src/agent/agent-gateway.module.ts
import { Module } from '@nestjs/common';

import { AgentGatewayService } from './agent-gateway.service';
import { AgentController } from './agent.controller';
import { AuthGatewayModule } from '../auth-gateway/auth-gateway.module';
import { RmqClientsModule } from 'src/common/rmq-clients.module';


@Module({
  imports: [RmqClientsModule, AuthGatewayModule],
  providers: [AgentGatewayService],
  controllers: [AgentController],
  exports: [AgentGatewayService],
})
export class AgentGatewayModule {}
