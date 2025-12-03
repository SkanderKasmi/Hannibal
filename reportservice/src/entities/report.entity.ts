import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export type ReportTargetType = 'VM' | 'RESOURCE_GROUP';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ['pdf', 'excel'] })
  format: 'pdf' | 'excel';

  @Column({ type: 'enum', enum: ['VM', 'RESOURCE_GROUP'] })
  targetType: ReportTargetType;

  @Index()
  @Column({ nullable: true })
  vmId?: string;

  @Index()
  @Column({ nullable: true })
  resourceGroupId?: string;

  @Column()
  from: Date;

  @Column()
  to: Date;

  @Column()
  filename: string;

  @Column()
  url: string; // MEGA public link

  @Column({ type: 'json', nullable: true })
  meta?: any;

  @CreateDateColumn()
  createdAt: Date;
}
