// src/alert/agent-alert.service.ts
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AgentAlertService {
  private readonly logger = new Logger(AgentAlertService.name);

  async notifyDeploymentFailure(vmName: string, reason: string) {
    this.logger.warn(
      `Agent deployment failed on VM "${vmName}": ${reason}`,
    );
  }

  async notifyTaskFailure(agentId: string, taskId: string, reason: string) {
    this.logger.warn(
      `Task ${taskId} failed on agent ${agentId}: ${reason}`,
    );
  }
}
