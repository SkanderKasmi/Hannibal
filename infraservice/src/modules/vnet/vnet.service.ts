// src/modules/vnet/vnet.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VirtualNetwork } from '../../entities/virtual-network.entity';
import { ResourceGroup } from '../../entities/resource-group.entity';
import { Repository } from 'typeorm';
import { CreateVnetDto } from '../../dtos/vnet/create-vnet.dto';
import { UpdateVnetDto } from '../../dtos/vnet/update-vnet.dto';

@Injectable()
export class VnetService {
  constructor(
    @InjectRepository(VirtualNetwork)
    private readonly vnetRepo: Repository<VirtualNetwork>,
    @InjectRepository(ResourceGroup)
    private readonly rgRepo: Repository<ResourceGroup>,
  ) {}

  findAll() {
    return this.vnetRepo.find({ relations: ['resourceGroup'] });
  }

  async findOne(id: string) {
    const vn = await this.vnetRepo.findOne({
      where: { id },
      relations: ['resourceGroup'],
    });
    if (!vn) throw new NotFoundException('Virtual network not found');
    return vn;
  }

  async create(dto: CreateVnetDto) {
    const rg = await this.rgRepo.findOne({ where: { id: dto.resourceGroupId } });
    if (!rg) throw new NotFoundException('Resource group not found');
    const vn = this.vnetRepo.create({
      name: dto.name,
      cidr: dto.cidr,
      active: dto.active,
      resourceGroup: rg,
    });
    return this.vnetRepo.save(vn);
  }

  async update(id: string, dto: UpdateVnetDto) {
    const vn = await this.findOne(id);
    Object.assign(vn, dto);
    return this.vnetRepo.save(vn);
  }

  async remove(id: string) {
    const vn = await this.findOne(id);
    await this.vnetRepo.remove(vn);
    return { deleted: true };
  }
}
