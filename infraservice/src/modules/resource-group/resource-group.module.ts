// src/modules/resource-group/resource-group.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceGroup } from '../../entities/resource-group.entity';
import { Vm } from '../../entities/vm.entity';
import { ResourceGroupService } from './resource-group.service';
import { ResourceGroupController } from './resource-group.controller';
import { RedisCacheService } from '../../services/redis-cache.service';

@Module({
  imports: [TypeOrmModule.forFeature([ResourceGroup, Vm])],
  providers: [ResourceGroupService, RedisCacheService],
  controllers: [ResourceGroupController],
  exports: [ResourceGroupService],
})
export class ResourceGroupModule {}
