// src/controllers/projection.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProjectionService } from '../services/projection.service';
import type { ProjectionMetric } from '../services/projection.service';

@Controller('projection')
export class ProjectionController {
  constructor(private readonly projection: ProjectionService) {}

  @Get('vm/:vmId')
  projectVm(
    @Param('vmId') vmId: string,
    @Query('metric') metric: ProjectionMetric,
    @Query('horizon') horizon = '60',
  ) {
    return this.projection.projectVmMetric(
      vmId,
      metric,
      parseInt(horizon, 10) || 60,
    );
  }

  @Get('rg/:rgId')
  projectRg(
    @Param('rgId') rgId: string,
    @Query('metric') metric: ProjectionMetric,
    @Query('horizon') horizon = '60',
  ) {
    return this.projection.projectResourceGroupMetric(
      rgId,
      metric,
      parseInt(horizon, 10) || 60,
    );
  }
}
