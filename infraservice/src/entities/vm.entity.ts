// src/entities/vm.entity.ts
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { ResourceGroup } from './resource-group.entity';

export type VmConnectionType = 'SSH' | 'GRPC' | 'HTTPS';
export type VmAuthType = 'PASSWORD' | 'KEY';

@Entity('vms')
export class Vm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ResourceGroup, (rg) => rg.vms, { nullable: false })
  resourceGroup: ResourceGroup;

  @Column()
  name: string;

  @Column()
  hostname: string;

  @Column()
  ipAddress: string;

  @Column({ default: 22 })
  sshPort: number;

  @Column({ type: 'enum', enum: ['SSH', 'GRPC', 'HTTPS'] })
  connectionType: VmConnectionType;

  @Column({ type: 'enum', enum: ['PASSWORD', 'KEY'] })
  authType: VmAuthType;

  @Column()
  username: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  publicKey?: string;

  @Column({
    default: 'CREATING',
  })
  status: 'CREATING' | 'RUNNING' | 'STOPPED' | 'ERROR';

  @CreateDateColumn()
  createdAt: Date;
}
