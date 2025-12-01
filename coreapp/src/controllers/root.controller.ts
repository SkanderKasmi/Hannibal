// src/controllers/root.controller.ts
import { Controller, Get } from '@nestjs/common';
import { Public } from '../utils/decorators/public.decorator';

@Controller()
export class RootController {
  @Get('/')
  @Public()
  info() {
    return {
      service: 'core-gateway',
      status: 'ok',
      docs: '/api/docs',
      graphql: '/graphql',
      time: new Date().toISOString(),
    };
  }
}
