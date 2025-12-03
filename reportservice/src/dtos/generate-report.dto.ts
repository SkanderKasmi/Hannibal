// src/dtos/generate-report.dto.ts
import { IsString, IsOptional, IsEnum, IsISO8601 } from 'class-validator';
import type { ReportFormat } from '../interfaces/report.interface';

export class GenerateReportDto {
  @IsOptional()
  @IsString()
  vmId?: string;

  @IsOptional()
  @IsString()
  resourceGroupId?: string;

  @IsISO8601()
  from: string; // ISO string

  @IsISO8601()
  to: string;

  @IsEnum(['pdf', 'excel'] as const)
  format: ReportFormat;
}
