// src/entities/virtual-network.entity.ts
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ResourceGroup } from './resource-group.entity';

@Entity('virtual_networks')
export class VirtualNetwork {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ResourceGroup, (rg) => rg.virtualNetworks, {
    nullable: false,
  })
  resourceGroup: ResourceGroup;

  @Column()
  name: string;

  @Column()
  cidr: string; // e.g. 10.0.0.0/24

  @Column({ default: true })
  active: boolean;
}
