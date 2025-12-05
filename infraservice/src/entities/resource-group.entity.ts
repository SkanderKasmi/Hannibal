// src/entities/resource-group.entity.ts
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Vm } from './vm.entity';
import { VirtualNetwork } from './virtual-network.entity';

export type ProviderType = 'LOCAL' | 'AWS' | 'GCP' | 'AZURE';

@Entity('resource_groups')
export class ResourceGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: ['LOCAL', 'AWS', 'GCP', 'AZURE'],
    default: 'LOCAL',
  })
  providerType: ProviderType;

  @Column({ nullable: true })
  externalAddress?: string; // e.g. ARN, Azure ID, etc.

  @Column({ nullable: true })
  pat?: string; // token / PAT for external provider

  @OneToMany(() => Vm, (vm) => vm.resourceGroup, { cascade: true })
  vms: Vm[];

  @OneToMany(() => VirtualNetwork, (vn) => vn.resourceGroup, {
    cascade: true,
  })
  virtualNetworks: VirtualNetwork[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
