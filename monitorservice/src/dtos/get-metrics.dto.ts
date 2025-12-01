import { IsOptional, IsString } from 'class-validator';

export class GetMetricsDto {
  @IsOptional()
  @IsString()
  vmId?: string;

  @IsOptional()
  @IsString()
  resourceGroupId?: string;
}
