// src/modules/job/job.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from '../../entities/job.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
  ) {}

  listJobs() {
    return this.jobRepo.find({ relations: ['pipeline'] });
  }

  getJob(id: string) {
    return this.jobRepo.findOne({ where: { id }, relations: ['pipeline'] });
  }
}
