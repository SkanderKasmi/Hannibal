// src/services/agent-bridge.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { TaskType } from '../entities/task.entity';

@Injectable()
export class AgentBridgeService {
  constructor(
    @Inject('AGENT_SERVICE') private readonly agentClient: ClientProxy,
  ) {}

  async runTaskOnAgent(input: {
    vmId: string;
    type: TaskType;
    command: string;
    jobId: string;
    taskId: string;
  }) {
    const res$ = this.agentClient.send(
      { cmd: 'agent.runTask' },
      input,
    );
    return firstValueFrom(res$);
  }
}
