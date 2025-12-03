// src/dtos/report-metadata.dto.ts
import { ReportFormat } from '../interfaces/report.interface';

export class ReportMetadataDto {
  id: string;
  format: ReportFormat;
  targetType: 'VM' | 'RESOURCE_GROUP';
  vmId?: string;
  resourceGroupId?: string;
  from: string;
  to: string;
  filename: string;
  url: string;
  createdAt: string;
}
