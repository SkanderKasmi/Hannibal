// src/entities/task.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Pipeline } from './pipeline.entity';

export type TaskType = 'shell' | 'ansible' | 'terraform';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Pipeline, (p) => p.tasks, { onDelete: 'CASCADE' })
  pipeline: Pipeline;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: ['shell', 'ansible', 'terraform'] })
  type: TaskType;

  @Column()
  orderIndex: number;

  @Column()
  command: string; // shell command or playbook path or terraform dir

  @Column({ nullable: true })
  vmId?: string; // targeted VM (for agent)
}
