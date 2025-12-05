// src/modules/vnet/vnet.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VirtualNetwork } from '../../entities/virtual-network.entity';
import { ResourceGroup } from '../../entities/resource-group.entity';
import { VnetService } from './vnet.service';
import { VnetController } from './vnet.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VirtualNetwork, ResourceGroup])],
  providers: [VnetService],
  controllers: [VnetController],
  exports: [VnetService],
})
export class VnetModule {}
