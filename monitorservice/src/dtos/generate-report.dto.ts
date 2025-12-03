export class GenerateReportDto {
  vmId?: string;              // optional, if specific VM
  resourceGroupId?: string;   // optional, if entire RG
  from: string;               // ISO datetime string
  to: string;                 // ISO datetime string
  type: 'pdf' | 'excel';
}
