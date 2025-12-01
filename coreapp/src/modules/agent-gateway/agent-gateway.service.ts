
// src/agent/agent-gateway.service.ts
import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthGatewayService } from 'src/modules/auth-gateway/auth-gateway.service';


export type TaskType = 'pipeline' | 'ansible' | 'terraform';

@Injectable()
export class AgentGatewayService {
  constructor(
    @Inject('AGENT_SERVICE') private readonly agentClient: ClientProxy,
    private readonly authGateway: AuthGatewayService,
  ) {}

  async deployAgentsToResourceGroup(userId: string, resourceGroupId: string) {
    const allowed = await this.authGateway.checkPermission(
      userId,
      'AGENT_DEPLOY',
      'RESOURCE_GROUP',
      resourceGroupId,
    );
    if (!allowed) {
      throw new ForbiddenException('No permission to deploy agents');
    }

    const res$ = this.agentClient.send(
      { cmd: 'agent.deployToResourceGroup' },
      { resourceGroupId, requestedBy: userId },
    );
    return firstValueFrom(res$);
  }

  async runTaskOnAgent(
    userId: string,
    agentId: string,
    taskType: TaskType,
    payload: any,
  ) {
    const allowed = await this.authGateway.checkPermission(
      userId,
      'AGENT_RUN_TASK',
      'AGENT',
      agentId,
    );
    if (!allowed) {
      throw new ForbiddenException('No permission to run tasks');
    }

    const res$ = this.agentClient.send(
      { cmd: 'agent.runTask' },
      { agentId, taskType, payload, requestedBy: userId },
    );
    return firstValueFrom(res$);
  }
}
