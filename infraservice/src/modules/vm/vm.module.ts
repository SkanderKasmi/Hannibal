// src/modules/vm/vm.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vm } from '../../entities/vm.entity';
import { ResourceGroup } from '../../entities/resource-group.entity';
import { VmService } from './vm.service';
import { VmController } from './vm.controller';
import { VmProvisioningService } from './vm.provisioning.service';
import { InfraAlertService } from '../../alert/infra-alert.service';
import { RedisCacheService } from '../../services/redis-cache.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vm, ResourceGroup])],
  providers: [
    VmService,
    VmProvisioningService,
    InfraAlertService,
    RedisCacheService,
  ],
  controllers: [VmController],
  exports: [VmService],
})
export class VmModule {}
