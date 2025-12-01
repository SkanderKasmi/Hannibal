// src/modules/vm/vm.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vm } from '../../entities/vm.entity';
import { ResourceGroup } from '../../entities/resource-group.entity';
import { Repository } from 'typeorm';
import { CreateVmDto } from '../../dtos/vm/create-vm.dto';
import { UpdateVmDto } from '../../dtos/vm/update-vm.dto';
import { ExecuteCommandDto } from '../../dtos/vm/execute-command.dto';
import { VmProvisioningService } from './vm.provisioning.service';
import { RedisCacheService } from '../../services/redis-cache.service';

@Injectable()
export class VmService {
  constructor(
    @InjectRepository(Vm)
    private readonly vmRepo: Repository<Vm>,
    @InjectRepository(ResourceGroup)
    private readonly rgRepo: Repository<ResourceGroup>,
    private readonly provisioning: VmProvisioningService,
    private readonly cache: RedisCacheService,
  ) {}

  async findAll() {
    const cacheKey = 'vm:all';
    const cached = await this.cache.get<Vm[]>(cacheKey);
    if (cached) return cached;

    const vms = await this.vmRepo.find({ relations: ['resourceGroup'] });
    await this.cache.set(cacheKey, vms, 30);
    return vms;
  }

  async findOne(id: string) {
    const cacheKey = `vm:${id}`;
    const cached = await this.cache.get<Vm>(cacheKey);
    if (cached) return cached;

    const vm = await this.vmRepo.findOne({
      where: { id },
      relations: ['resourceGroup'],
    });
    if (!vm) throw new NotFoundException('VM not found');

    await this.cache.set(cacheKey, vm, 30);
    return vm;
  }

  async create(dto: CreateVmDto) {
    const rg = await this.rgRepo.findOne({ where: { id: dto.resourceGroupId } });
    if (!rg) throw new BadRequestException('Resource group does not exist');

    const vm = this.vmRepo.create({
      ...dto,
      resourceGroup: rg,
      status: 'CREATING',
    });

    const saved = await this.vmRepo.save(vm);

    await this.cache.del('vm:all');
    await this.cache.del(`rg:${rg.id}:vms`);
    await this.cache.del(`rg:${rg.id}:withVms`);

    this.provisioning
      .deployScripts(saved)
      .then(async () => {
        saved.status = 'RUNNING';
        await this.vmRepo.save(saved);
        await this.cache.del(`vm:${saved.id}`);
        await this.cache.del('vm:all');
      })
      .catch(async (err) => {
        console.error(err);
        saved.status = 'ERROR';
        await this.vmRepo.save(saved);
        await this.cache.del(`vm:${saved.id}`);
      });

    return saved;
  }

  async update(id: string, dto: UpdateVmDto) {
    const vm = await this.vmRepo.findOne({ where: { id } });
    if (!vm) throw new NotFoundException('VM not found');

    Object.assign(vm, dto);
    const saved = await this.vmRepo.save(vm);

    await this.cache.del(`vm:${id}`);
    await this.cache.del('vm:all');
    await this.cache.del(`rg:${vm.resourceGroup?.id}:vms`);
    await this.cache.del(`rg:${vm.resourceGroup?.id}:withVms`);

    return saved;
  }

  async remove(id: string) {
    const vm = await this.vmRepo.findOne({
      where: { id },
      relations: ['resourceGroup'],
    });
    if (!vm) throw new NotFoundException('VM not found');
    const rgId = vm.resourceGroup?.id;

    await this.vmRepo.remove(vm);
    await this.cache.del(`vm:${id}`);
    await this.cache.del('vm:all');
    if (rgId) {
      await this.cache.del(`rg:${rgId}:vms`);
      await this.cache.del(`rg:${rgId}:withVms`);
    }

    return { deleted: true };
  }

  async executeCommand(dto: ExecuteCommandDto) {
    const vm = await this.findOne(dto.vmId);
    return this.provisioning.executeCommand(vm, dto.command);
  }
}
