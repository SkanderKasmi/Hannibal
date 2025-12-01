// src/modules/agent/agent.rmq.handler.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AgentService } from './agent.service';
import { TaskType } from '../../interfaces/agent-task.interface';

@Controller()
export class AgentRmqHandler {
  constructor(private readonly agentService: AgentService) {}

  @MessagePattern({ cmd: 'agent.deployToResourceGroup' })
  deploy(@Payload() payload: { resourceGroupId: string; requestedBy: string }) {
    return this.agentService.deployAgentsToResourceGroup(
      payload.resourceGroupId,
      payload.requestedBy,
    );
  }

  @MessagePattern({ cmd: 'agent.runTask' })
  runTask(
    @Payload()
    payload: {
      agentId: string;
      taskType: TaskType;
      payload: any;
      requestedBy: string;
    },
  ) {
    return this.agentService.runTaskOnAgent(
      payload.agentId,
      payload.taskType,
      payload.payload,
      payload.requestedBy,
    );
  }

  @MessagePattern({ cmd: 'agent.getStatus' })
  getStatus(@Payload() payload: { agentId: string }) {
    return this.agentService.getAgent(payload.agentId);
  }
}
