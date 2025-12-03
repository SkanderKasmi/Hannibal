// src/modules/rmq/automation-rmq.module.ts
import { Module } from '@nestjs/common';
import { AutomationRmqHandler } from './automation-rmq.handler';
import { OrchestrationService } from '../../services/orchestration.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from '../../entities/job.entity';
import { Pipeline } from '../../entities/pipeline.entity';
import { Task } from '../../entities/task.entity';
import { AgentBridgeService } from '../../services/agent-bridge.service';
import { ClientsModule } from '@nestjs/microservices';
import { agentClientOptions } from '../../config/rmq.config';
import { JobAlertService } from '../../alert/job-alert.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, Pipeline, Task]),
    ClientsModule.register([{ name: 'AGENT_SERVICE', ...agentClientOptions }]),
  ],
  providers: [
    AutomationRmqHandler,
    OrchestrationService,
    AgentBridgeService,
    JobAlertService,
  ],
})
export class AutomationRmqModule {}
