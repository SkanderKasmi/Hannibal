// src/modules/job/job.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { JobService } from './job.service';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  list() {
    return this.jobService.listJobs();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.jobService.getJob(id);
  }
}
