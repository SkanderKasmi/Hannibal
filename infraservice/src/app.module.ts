// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './config/typeorm.config';
import { ResourceGroupModule } from './modules/resource-group/resource-group.module';
import { VmModule } from './modules/vm/vm.module';
import { VnetModule } from './modules/vnet/vnet.module';
import { SeedModule } from './modules/seed/seed.module';
import { HealthModule } from './health/health.module';
import { InfraStatusController } from './controllers/infra-status.controller';
import { InfraRmqController } from './controllers/infra-rmq.controller';
import { InfraEventsService } from './services/infra-events.service';
import { CloudSyncService } from './services/cloud-sync.service';
import { RedisCacheService } from './services/redis-cache.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env',
      ],
    }),
    TypeOrmModule.forRootAsync(typeormConfig),
    ResourceGroupModule,
    VmModule,
    VnetModule,
    SeedModule,
    HealthModule,
  ],
  controllers: [InfraStatusController, InfraRmqController],
  providers: [
    InfraEventsService,
    CloudSyncService,
    RedisCacheService,       // ⬅️ add
  ],
})
export class AppModule {}
