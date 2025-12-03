// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AgentModule } from './modules/agent/agent.module';
import { HealthModule } from './health/health.module';
import { AgentManagementController } from './controllers/agent-management.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env',
      ],
    }),
    AgentModule,
    HealthModule,
  ],
  controllers: [AgentManagementController],
})
export class AppModule {}
