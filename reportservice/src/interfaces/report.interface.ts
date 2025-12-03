// src/interfaces/report.interface.ts
export type ReportFormat = 'pdf' | 'excel';

export interface ReportRecord {
  id: string;
  format: ReportFormat;
  targetType: 'VM' | 'RESOURCE_GROUP';
  vmId?: string;
  resourceGroupId?: string;
  from: Date;
  to: Date;
  filename: string;
  url: string;
  createdAt: Date;
}
