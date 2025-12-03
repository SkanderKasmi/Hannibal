// src/controllers/automation.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('automation')
export class AutomationController {
  @Get('summary')
  summary() {
    return {
      service: 'automation-service',
      description: 'Orchestrates pipelines and jobs across VMs via agents',
      time: new Date().toISOString(),
    };
  }
}
