// src/entities/job.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pipeline } from './pipeline.entity';

export type JobStatus = 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Pipeline, { eager: true })
  pipeline: Pipeline;

  @Column({ type: 'enum', enum: ['PENDING', 'RUNNING', 'SUCCESS', 'FAILED'] })
  status: JobStatus;

  @Column({ nullable: true })
  errorMessage?: string;

  @Column({ nullable: true })
  startedBy?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
