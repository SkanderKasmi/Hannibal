// src/modules/pipeline/pipeline.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pipeline } from '../../entities/pipeline.entity';
import { Task } from '../../entities/task.entity';
import { Repository } from 'typeorm';
import {
  CreatePipelineDto,
  CreateTaskInputDto,
  RunPipelineDto,
} from '../../dtos/pipeline/create-pipeline.dto';
import { OrchestrationService } from '../../services/orchestration.service';

@Injectable()
export class PipelineService {
  constructor(
    @InjectRepository(Pipeline)
    private readonly pipelineRepo: Repository<Pipeline>,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    private readonly orchestration: OrchestrationService,
  ) {}

  async createPipeline(dto: CreatePipelineDto) {
    const pipeline = this.pipelineRepo.create({
      name: dto.name,
      description: dto.description,
    });
    const saved = await this.pipelineRepo.save(pipeline);

    const tasks: Task[] = dto.tasks.map((t: CreateTaskInputDto) =>
      this.taskRepo.create({
        pipeline: saved,
        name: t.name,
        type: t.type,
        orderIndex: t.orderIndex,
        command: t.command,
        vmId: t.vmId,
      }),
    );
    await this.taskRepo.save(tasks);

    return this.pipelineRepo.findOne({
      where: { id: saved.id },
      relations: ['tasks'],
    });
  }

  async listPipelines() {
    return this.pipelineRepo.find({ relations: ['tasks'] });
  }

  async runPipeline(dto: RunPipelineDto) {
    return this.orchestration.startJob(dto.pipelineId, dto.startedBy);
  }
}
