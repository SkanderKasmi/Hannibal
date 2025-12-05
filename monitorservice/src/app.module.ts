import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MetricsModule } from './modules/metrics/metrics.module';
import { HealthModule } from './health/health.module';
import { InfraBridgeModule } from './modules/infra-bridge/infra-bridge.module';
import { ReportBridgeModule } from './modules/report-bridge/report-bridge.module';
import { MonitorController } from './controllers/monitor.controller';
import { typeormConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true , 
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env',
      ],
    }),
    TypeOrmModule.forRootAsync(typeormConfig),
    MetricsModule,
    HealthModule,
    InfraBridgeModule,
    ReportBridgeModule,
  ],
  controllers: [AppController, MonitorController],
  providers: [AppService],
})
export class AppModule {}
