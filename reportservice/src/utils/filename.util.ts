// src/utils/filename.util.ts
import { ReportFormat } from '../interfaces/report.interface';

export function buildReportFilename(input: {
  vmId?: string;
  vmName?: string;
  resourceGroupId?: string;
  resourceGroupName?: string;
  from: Date;
  to: Date;
  format: ReportFormat;
}) {
  const parts: string[] = ['hannibal-report'];

  if (input.vmName || input.vmId) {
    parts.push(`vm-${input.vmName || input.vmId}`);
  }
  if (input.resourceGroupName || input.resourceGroupId) {
    parts.push(`rg-${input.resourceGroupName || input.resourceGroupId}`);
  }

  parts.push(
    input.from.toISOString().slice(0, 10),
    input.to.toISOString().slice(0, 10),
  );

  return `${parts.join('_')}.${input.format === 'pdf' ? 'pdf' : 'xlsx'}`;
}
