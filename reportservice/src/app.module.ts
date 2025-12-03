import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { HealthModule } from './health/health.module';
import { ReportModule } from './modules/report/report.module';
import { StorageModule } from './modules/storage/storage.module';
import { CleanupService } from './services/cleanup.service';
import { ReportAdminController } from './controllers/report-admin.controller';

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
        database: process.env.DB_NAME || 'report_db',
        entities: [Report],
        synchronize: true, // ⚠️ false in real prod
      }),
    }),
    TypeOrmModule.forFeature([Report]),
    HealthModule,
    StorageModule,
    ReportModule,
  ],
  controllers: [ReportAdminController],
  providers: [CleanupService],
})
export class AppModule {}
