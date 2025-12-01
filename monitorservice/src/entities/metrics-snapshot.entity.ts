import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('metrics_snapshots')
export class MetricsSnapshot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vmId: string;

  @Column()
  resourceGroupId: string;

  @Column()
  os: string;

  @Column('float')
  cpuLoad: number;

  @Column('float')
  memoryUsagePercent: number;

  @Column('float')
  diskUsedPercent: number;

  @Column('float')
  networkRx: number;

  @Column('float')
  networkTx: number;

  @Column('float', { nullable: true })
  loadScore?: number; // combined metric score

  @Column('json', { nullable: true })
  rawMetrics?: any; // optional full raw metrics

  @CreateDateColumn()
  timestamp: Date;
}
