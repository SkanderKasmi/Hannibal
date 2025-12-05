// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pipeline } from './entities/pipeline.entity';
import { Task } from './entities/task.entity';
import { Job } from './entities/job.entity';
import { PipelineModule } from './modules/pipeline/pipeline.module';
import { JobModule } from './modules/job/job.module';
import { AutomationRmqModule } from './modules/rmq/automation-rmq.module';
import { HealthModule } from './health/health.module';
import { AutomationController } from './controllers/automation.controller';
import { buildAutomationDbConfig } from './config/db.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env',
      ],
    }),
TypeOrmModule.forRootAsync({
      useFactory: async () => buildAutomationDbConfig(),
    }),
    PipelineModule,
    JobModule,
    AutomationRmqModule,
    HealthModule,
  ],
  controllers: [AutomationController],
})
export class AppModule {}
