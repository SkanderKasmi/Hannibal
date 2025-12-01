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
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 5432),
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'automation_db',
        entities: [Pipeline, Task, Job],
        synchronize: true, // ⚠️ false in real prod
      }),
    }),
    PipelineModule,
    JobModule,
    AutomationRmqModule,
    HealthModule,
  ],
  controllers: [AutomationController],
})
export class AppModule {}
