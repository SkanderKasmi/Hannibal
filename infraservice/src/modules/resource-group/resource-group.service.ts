// src/modules/resource-group/resource-group.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceGroup } from '../../entities/resource-group.entity';
import { Repository } from 'typeorm';
import { CreateResourceGroupDto } from '../../dtos/resource-group/create-resource-group.dto';
import { UpdateResourceGroupDto } from '../../dtos/resource-group/update-resource-group.dto';
import { Vm } from '../../entities/vm.entity';
import { RedisCacheService } from '../../services/redis-cache.service';

@Injectable()
export class ResourceGroupService {
  constructor(
    @InjectRepository(ResourceGroup)
    private readonly rgRepo: Repository<ResourceGroup>,
    @InjectRepository(Vm)
    private readonly vmRepo: Repository<Vm>,
    private readonly cache: RedisCacheService,
  ) {}

  async findAll() {
    const cacheKey = 'rg:all';
    const cached = await this.cache.get<ResourceGroup[]>(cacheKey);
    if (cached) return cached;

    const data = await this.rgRepo.find();
    await this.cache.set(cacheKey, data, 60);
    return data;
  }

  async findOne(id: string) {
    const cacheKey = `rg:${id}`;
    const cached = await this.cache.get<ResourceGroup>(cacheKey);
    if (cached) return cached;

    const rg = await this.rgRepo.findOne({ where: { id } });
    if (!rg) throw new NotFoundException('ResourceGroup not found');

    await this.cache.set(cacheKey, rg, 60);
    return rg;
  }

  async findOneWithVms(id: string) {
    const cacheKey = `rg:${id}:withVms`;
    const cached = await this.cache.get<ResourceGroup>(cacheKey);
    if (cached) return cached;

    const rg = await this.rgRepo.findOne({
      where: { id },
      relations: ['vms'],
    });
    if (!rg) throw new NotFoundException('ResourceGroup not found');

    await this.cache.set(cacheKey, rg, 60);
    return rg;
  }

  async create(dto: CreateResourceGroupDto) {
    const rg = this.rgRepo.create(dto);
    const saved = await this.rgRepo.save(rg);
    await this.cache.del('rg:all');
    return saved;
  }

  async update(id: string, dto: UpdateResourceGroupDto) {
    const rg = await this.findOne(id);
    Object.assign(rg, dto);
    const saved = await this.rgRepo.save(rg);
    await this.cache.del(`rg:${id}`);
    await this.cache.del(`rg:${id}:withVms`);
    await this.cache.del('rg:all');
    return saved;
  }

  async remove(id: string) {
    const rg = await this.findOne(id);
    await this.rgRepo.remove(rg);
    await this.cache.del(`rg:${id}`);
    await this.cache.del(`rg:${id}:withVms`);
    await this.cache.del('rg:all');
    return { deleted: true };
  }

  async listVmsInGroup(resourceGroupId: string) {
    const cacheKey = `rg:${resourceGroupId}:vms`;
    const cached = await this.cache.get<Vm[]>(cacheKey);
    if (cached) return cached;

    const vms = await this.vmRepo.find({
      where: { resourceGroup: { id: resourceGroupId } },
      relations: ['resourceGroup'],
    });
    await this.cache.set(cacheKey, vms, 30);
    return vms;
  }
}
