/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/monitor/monitor.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MonitorGatewayService } from './monitor-gateway.service';
import { SessionGuard } from 'src/security/session.guard';
import { RmqAuthGuard } from 'src/security/rmq-auth.guard';


@Controller('monitor')
@UseGuards(RmqAuthGuard)
export class MonitorController {
  constructor(private readonly monitor: MonitorGatewayService) {}

  private getUserId(req: any): string {
    return req.currentUser?.id || req.user?.id || req.session?.user?.id || 'anonymous';
  }

  @Get('vm/:id/live')
  getVmLive(@Param('id') id: string) {
    return this.monitor.getVmLive(id);
  }

  @Get('vm/:id/history')
  getVmHistory(@Param('id') id: string) {
    return this.monitor.getVmHistory(id);
  }

  @Post('vm/:id/report')
  createVmReport(
    @Param('id') id: string,
    @Body() body: { format: 'PDF' | 'XLSX' },
    @Req() req: any,
  ) {
    return this.monitor.generateVmReport(
      id,
      body.format,
      this.getUserId(req),
    );
  }
}
