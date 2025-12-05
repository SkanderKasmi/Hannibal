/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */

// src/agent/agent.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AgentGatewayService, TaskType } from './agent-gateway.service';
import { SessionGuard } from 'src/security/session.guard';
import { RmqAuthGuard } from 'src/security/rmq-auth.guard';


@Controller('agents')
@UseGuards(RmqAuthGuard)
export class AgentController {
  constructor(private readonly agent: AgentGatewayService) {}

  private getUserId(req: any) {
    return req.currentUser?.id || req.user?.id || req.session?.user?.id || 'anonymous';
  }

  @Post('deploy/resource-group/:id')
  deployToRg(@Param('id') id: string, @Req() req: any) {
    return this.agent.deployAgentsToResourceGroup(this.getUserId(req), id);
  }

  @Post(':agentId/run-task')
  runTask(
    @Param('agentId') agentId: string,
    @Body() body: { taskType: TaskType; payload: any },
    @Req() req: any,
  ) {
    return this.agent.runTaskOnAgent(
      this.getUserId(req),
      agentId,
      body.taskType,
      body.payload,
    );
  }
}
