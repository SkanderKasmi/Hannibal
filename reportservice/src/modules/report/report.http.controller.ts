// src/modules/report/report.http.controller.ts
import { Body, Controller, Get, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ReportService } from './report.service';
import { GenerateReportDto } from '../../dtos/generate-report.dto';

import { AuthGuard } from '../../security/auth.guard';
import { ReportValidationPipe } from 'src/validation/pipes/report-exception.filter';

@Controller('reports')
@UseGuards(AuthGuard)
export class ReportHttpController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @UsePipes(ReportValidationPipe)
  generate(@Body() dto: GenerateReportDto) {
    return this.reportService.generate(dto);
  }

  @Get()
  list() {
    return this.reportService.list();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.reportService.get(id);
  }
}
