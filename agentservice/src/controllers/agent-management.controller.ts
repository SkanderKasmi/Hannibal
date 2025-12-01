// src/controllers/agent-management.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AgentService } from '../modules/agent/agent.service';

@Controller('agent-management')
export class AgentManagementController {
  constructor(private readonly agentService: AgentService) {}

  @Get('summary')
  summary() {
    const agents = this.agentService.listAgents();
    const tasks = this.agentService.listTasks();

    return {
      agentsCount: agents.length,
      tasksCount: tasks.length,
      agents,
      tasks,
    };
  }
}
