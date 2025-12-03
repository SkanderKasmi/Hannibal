// src/modules/pipeline/pipeline.controller.ts
import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { PipelineService } from './pipeline.service';
import { CreatePipelineDto, RunPipelineDto } from '../../dtos/pipeline/create-pipeline.dto';
import { PipelineValidationPipe } from '../../validation/pipes/pipeline-validation.pipe';
import { AuthGuard } from '../../security/auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('pipelines')
@UseGuards(AuthGuard)
export class PipelineController {
  constructor(private readonly pipelineService: PipelineService) {}

  @Post()
  @UsePipes(PipelineValidationPipe)
  create(@Body() dto: CreatePipelineDto) {
    return this.pipelineService.createPipeline(dto);
  }

  @Get()
  list() {
    return this.pipelineService.listPipelines();
  }

  @Post('run')
  run(@Body() dto: RunPipelineDto) {
    return this.pipelineService.runPipeline(dto);
  }
}
