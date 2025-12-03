// src/modules/agent/agent.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InfraBridgeService } from '../../services/infra-bridge.service';
import { AutomationBridgeService } from '../../services/automation-bridge.service';
import { Agent } from '../../interfaces/agent.interface';
import { AgentTask, TaskType } from '../../interfaces/agent-task.interface';
import { AgentAlertService } from '../../alert/agent-alert.service';
import { SshUtil, SshConnectionInfo } from '../../utils/ssh.util';
import { ScriptUtil } from '../../utils/script.util';
import { sshConfig } from '../../config/ssh.config';
import { AgentSettings } from '../../settings/agent.settings';

@Injectable()
export class AgentService {
  private agents = new Map<string, Agent>();
  private tasks = new Map<string, AgentTask>();

  constructor(
    private readonly infraBridge: InfraBridgeService,
    private readonly automationBridge: AutomationBridgeService,
    private readonly alert: AgentAlertService,
  ) {}

  // Build SSH connection info from VM metadata
  private buildConnection(vm: any): SshConnectionInfo {
    return {
      host: vm.ipAddress,
      port: vm.sshPort || sshConfig.defaultPort,
      username: vm.username,
      authType: vm.authType,
      password: vm.password,
      privateKey: vm.privateKey,
    };
  }

  private createAgentId(vmId: string): string {
    return `agent_${vmId}`;
  }

  async deployAgentsToResourceGroup(
    resourceGroupId: string,
    requestedBy: string,
  ): Promise<Agent[]> {
    const rg = await this.infraBridge.getResourceGroupWithVms(resourceGroupId);

    const results: Agent[] = [];

    for (const vm of rg.vms) {
      if (vm.status !== 'RUNNING') {
        continue;
      }

      const agentId = this.createAgentId(vm.id);
      const agent: Agent = {
        id: agentId,
        vmId: vm.id,
        vmName: vm.name,
        resourceGroupId: rg.id,
        resourceGroupName: rg.name,
        status: 'DEPLOYING',
        lastHeartbeat: Date.now(),
      };

      this.agents.set(agentId, agent);

      try {
        const conn = this.buildConnection(vm);
        const localAgentScript = ScriptUtil.getLocalAgentScriptPath();
        const remoteDir = sshConfig.agentRemoteDir;
        const remoteScript = AgentSettings.AGENT_SCRIPT_REMOTE;

        // Ensure agent directory
        await SshUtil.runCommand(conn, `mkdir -p ${remoteDir}`);

        // Upload agent.sh
        await SshUtil.uploadFile(conn, localAgentScript, remoteScript);

        // Make it executable
        await SshUtil.runCommand(conn, `chmod +x ${remoteScript}`);

        // Start agent in background so it waits for tasks from automation
        // (agent.sh should internally connect to RabbitMQ/Kafka etc.)
        await SshUtil.runCommand(
          conn,
          `nohup ${remoteScript} run >> ${remoteDir}/agent.log 2>&1 &`,
        );

        agent.status = 'RUNNING';
        agent.lastHeartbeat = Date.now();
        this.agents.set(agentId, agent);
        results.push(agent);
      } catch (err: any) {
        agent.status = 'ERROR';
        this.agents.set(agentId, agent);
        await this.alert.notifyDeploymentFailure(vm.name, err.message);
      }
    }

    return results;
  }

  listAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  getAgent(agentId: string): Agent {
    const ag = this.agents.get(agentId);
    if (!ag) throw new NotFoundException('Agent not found');
    return ag;
  }

  listTasks(): AgentTask[] {
    return Array.from(this.tasks.values());
  }

  getTask(taskId: string): AgentTask {
    const t = this.tasks.get(taskId);
    if (!t) throw new NotFoundException('Task not found');
    return t;
  }

  async runTaskOnAgent(
    agentId: string,
    taskType: TaskType,
    payload: any,
    requestedBy: string,
  ) {
    const agent = this.getAgent(agentId);
    const vm = await this.infraBridge.getVmById(agent.vmId);

    const taskId = `task_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    const task: AgentTask = {
      id: taskId,
      agentId,
      type: taskType,
      payload,
      status: 'PENDING',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      requestedBy,
    };
    this.tasks.set(taskId, task);

    task.status = 'RUNNING';
    task.updatedAt = Date.now();
    this.tasks.set(taskId, task);

    try {
      // Delegate real execution to automation service
      const res = await this.automationBridge.runTaskForAgent({
        agentId,
        vmId: agent.vmId,
        resourceGroupId: agent.resourceGroupId,
        resourceGroupName: agent.resourceGroupName,
        taskType,
        payload,
        requestedBy,
      });

      task.status = res?.success ? 'SUCCESS' : 'FAILED';
      task.updatedAt = Date.now();
      this.tasks.set(taskId, task);

      if (!res?.success) {
        await this.alert.notifyTaskFailure(agentId, taskId, res?.error || 'Unknown error');
      }

      return { task, automationResult: res };
    } catch (err: any) {
      task.status = 'FAILED';
      task.updatedAt = Date.now();
      this.tasks.set(taskId, task);
      await this.alert.notifyTaskFailure(agentId, taskId, err.message);
      throw err;
    }
  }
}
