// src/modules/agent/agent.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import { AgentService } from './agent.service';
import { DeployAgentDto } from '../../dtos/deploy-agent.dto';
import { RunTaskDto } from '../../dtos/run-task.dto';
import { AgentValidationPipe } from 'src/validation/filters/agent-validation.pipe';


@Controller('agents')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post('deploy')
  @UsePipes(AgentValidationPipe)
  deploy(@Body() dto: DeployAgentDto) {
    return this.agentService.deployAgentsToResourceGroup(
      dto.resourceGroupId,
      dto.requestedBy,
    );
  }

  @Get()
  list() {
    return this.agentService.listAgents();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.agentService.getAgent(id);
  }

  @Post('run-task')
  @UsePipes(AgentValidationPipe)
  runTask(@Body() dto: RunTaskDto) {
    return this.agentService.runTaskOnAgent(
      dto.agentId,
      dto.taskType,
      dto.payload,
      dto.requestedBy,
    );
  }

  @Get('tasks/all')
  listTasks() {
    return this.agentService.listTasks();
  }

  @Get('tasks/:taskId')
  getTask(@Param('taskId') taskId: string) {
    return this.agentService.getTask(taskId);
  }
}
