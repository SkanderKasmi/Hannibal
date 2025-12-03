// src/services/orchestration.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pipeline } from '../entities/pipeline.entity';
import { Job, JobStatus } from '../entities/job.entity';
import { Task } from '../entities/task.entity';
import { AgentBridgeService } from './agent-bridge.service';
import { PipelineRunnerUtil } from '../utils/pipeline-runner.util';
import { JobAlertService } from '../alert/job-alert.service';

@Injectable()
export class OrchestrationService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
    @InjectRepository(Pipeline)
    private readonly pipelineRepo: Repository<Pipeline>,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    private readonly agentBridge: AgentBridgeService,
    private readonly alerts: JobAlertService,
  ) {}

  async startJob(pipelineId: string, startedBy?: string): Promise<Job> {
    const pipeline = await this.pipelineRepo.findOne({
      where: { id: pipelineId },
      relations: ['tasks'],
    });
    if (!pipeline) {
      throw new Error('Pipeline not found');
    }

    const job = this.jobRepo.create({
      pipeline,
      status: 'RUNNING',
      startedBy,
    });
    const savedJob = await this.jobRepo.save(job);

    this.executePipelineAsync(savedJob.id, pipeline).catch(console.error);
    return savedJob;
  }

  private async executePipelineAsync(jobId: string, pipeline: Pipeline) {
    PipelineRunnerUtil.logStart(pipeline.id);

    const job = await this.jobRepo.findOne({ where: { id: jobId } });
    if (!job) return;

    try {
      const orderedTasks = PipelineRunnerUtil.sortTasks(pipeline.tasks);

      for (const task of orderedTasks) {
        if (task.type === 'shell' && task.vmId) {
          await this.agentBridge.runTaskOnAgent({
            vmId: task.vmId,
            type: task.type,
            command: task.command,
            jobId,
            taskId: task.id,
          });
        } else if (task.type === 'ansible') {
          // You may either run directly here or ask an "ansible-agent"
          // For now, send to agent as well with a special type
          if (task.vmId) {
            await this.agentBridge.runTaskOnAgent({
              vmId: task.vmId,
              type: task.type,
              command: task.command,
              jobId,
              taskId: task.id,
            });
          } else {
            // no vmId provided — skip or handle accordingly
            console.warn(`Skipping ansible task ${task.id}: no vmId`);
          }
        } else if (task.type === 'terraform') {
          if (task.vmId) {
            await this.agentBridge.runTaskOnAgent({
              vmId: task.vmId,
              type: task.type,
              command: task.command,
              jobId,
              taskId: task.id,
            });
          } else {
            console.warn(`Skipping terraform task ${task.id}: no vmId`);
          }
        }
        // In a more advanced version, you’d wait for agent job result
      }

      job.status = 'SUCCESS';
      await this.jobRepo.save(job);
      PipelineRunnerUtil.logEnd(pipeline.id);
    } catch (err: any) {
      job.status = 'FAILED';
      job.errorMessage = err.message;
      await this.jobRepo.save(job);
      await this.alerts.notifyJobFailure(job.id, err.message);
    }
  }

  async updateJobStatus(dto: { jobId: string; status: JobStatus; errorMessage?: string }) {
    const job = await this.jobRepo.findOne({ where: { id: dto.jobId } });
    if (!job) return;
    job.status = dto.status;
    job.errorMessage = dto.errorMessage;
    await this.jobRepo.save(job);
  }
}
