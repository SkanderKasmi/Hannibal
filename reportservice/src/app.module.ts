import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { HealthModule } from './health/health.module';
import { ReportModule } from './modules/report/report.module';
import { StorageModule } from './modules/storage/storage.module';
import { CleanupService } from './services/cleanup.service';
import { ReportAdminController } from './controllers/report-admin.controller';
import { typeormConfig } from './config/typeorm.config';

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
    TypeOrmModule.forFeature([Report]),
    HealthModule,
    StorageModule,
    ReportModule,
  ],
  controllers: [ReportAdminController],
  providers: [CleanupService],
})
export class AppModule {}
