/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/report/report.controller.ts
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ReportGatewayService } from './report-gateway.service';
import { SessionGuard } from 'src/security/session.guard';


@Controller('reports')
@UseGuards(SessionGuard)
export class ReportController {
  constructor(private readonly report: ReportGatewayService) {}

  private getUserId(req: any) {
    return req.currentUser?.id || req.user?.id || req.session?.user?.id || 'anonymous';
  }

  @Get()
  list(@Req() req: any) {
    return this.report.listReports(this.getUserId(req));
  }

  @Get(':id')
  getOne(@Param('id') id: string, @Req() req: any) {
    return this.report.getReport(this.getUserId(req), id);
  }
}
