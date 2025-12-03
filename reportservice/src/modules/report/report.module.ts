// src/modules/report/report.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from '../../entities/report.entity';
import { ReportService } from './report.service';
import { ReportBuilderService } from './report-builder.service';
import { ReportRpcController } from './report.rpc.controller';
import { ReportHttpController } from './report.http.controller';
import { StorageModule } from '../storage/storage.module';
import { ReportAlertService } from '../../alert/report-alert.service';
import { ClientsModule } from '@nestjs/microservices';
import { monitorClientOptions } from '../../config/rmq.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report]),
    StorageModule,
    ClientsModule.register([
      { name: 'MONITOR_SERVICE', ...monitorClientOptions },
    ]),
  ],
  providers: [ReportService, ReportBuilderService, ReportAlertService],
  controllers: [ReportRpcController, ReportHttpController],
})
export class ReportModule {}
