// src/modules/pipeline/pipeline.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pipeline } from '../../entities/pipeline.entity';
import { Task } from '../../entities/task.entity';
import { PipelineService } from './pipeline.service';
import { PipelineController } from './pipeline.controller';
import { OrchestrationService } from '../../services/orchestration.service';
import { Job } from '../../entities/job.entity';
import { JobAlertService } from '../../alert/job-alert.service';
import { AgentBridgeService } from '../../services/agent-bridge.service';
import { ClientsModule } from '@nestjs/microservices';
import { agentClientOptions } from 'src/config/rmq.config';


@Module({
  imports: [
    TypeOrmModule.forFeature([Pipeline, Task, Job]),
    ClientsModule.register([{ name: 'AGENT_SERVICE', ...agentClientOptions }]),
  ],
  providers: [
    PipelineService,
    OrchestrationService,
    JobAlertService,
    AgentBridgeService,
  ],
  controllers: [PipelineController],
  exports: [OrchestrationService],
})
export class PipelineModule {}
