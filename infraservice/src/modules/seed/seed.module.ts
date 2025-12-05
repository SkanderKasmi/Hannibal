// src/modules/seed/seed.module.ts
import { Module } from '@nestjs/common';
import { InfraSeedService } from './infra-seed.service';
import { ResourceGroupModule } from '../resource-group/resource-group.module';

@Module({
  imports: [ResourceGroupModule],
  providers: [InfraSeedService],
})
export class SeedModule {}
