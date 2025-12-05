// src/controllers/infra-status.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('infra-status')
export class InfraStatusController {
  @Get()
  status() {
    return {
      service: 'infra-service',
      status: 'ok',
      time: new Date().toISOString(),
    };
  }
}
