// src/services/automation-bridge.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { TaskType } from '../interfaces/agent-task.interface';

@Injectable()
export class AutomationBridgeService {
  constructor(
    @Inject('AUTOMATION_SERVICE')
    private readonly automationClient: ClientProxy,
  ) {}

  async runTaskForAgent(input: {
    agentId: string;
    vmId: string;
    resourceGroupId: string;
    resourceGroupName: string;
    taskType: TaskType;
    payload: any;
    requestedBy: string;
  }) {
    const res$ = this.automationClient.send(
      { cmd: 'automation.runTaskForAgent' },
      input,
    );
    return firstValueFrom(res$);
  }
}
