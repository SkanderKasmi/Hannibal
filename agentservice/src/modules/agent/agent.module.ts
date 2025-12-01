// src/modules/agent/agent.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import {
  infraClientOptions,
  automationClientOptions,
} from '../../config/rmq.config';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { AgentRmqHandler } from './agent.rmq.handler';
import { InfraBridgeService } from '../../services/infra-bridge.service';
import { AutomationBridgeService } from '../../services/automation-bridge.service';
import { AgentAlertService } from '../../alert/agent-alert.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'INFRA_SERVICE',
        ...infraClientOptions,
      },
      {
        name: 'AUTOMATION_SERVICE',
        ...automationClientOptions,
      },
    ]),
  ],
  providers: [
    AgentService,
    InfraBridgeService,
    AutomationBridgeService,
    AgentAlertService,
  ],
  controllers: [AgentController, AgentRmqHandler],
  exports: [AgentService],
})
export class AgentModule {}
