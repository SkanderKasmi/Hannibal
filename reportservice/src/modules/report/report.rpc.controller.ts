// src/modules/report/report.rpc.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReportService } from './report.service';
import { GenerateReportDto } from '../../dtos/generate-report.dto';

@Controller()
export class ReportRpcController {
  constructor(private readonly reportService: ReportService) {}

  @MessagePattern({ cmd: 'report.build' })
  async build(@Payload() dto: GenerateReportDto) {
    return this.reportService.generate(dto);
  }
}
