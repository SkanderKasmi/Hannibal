// src/dtos/resource-group/create-resource-group.dto.ts
import { IsEnum, IsOptional, IsString } from 'class-validator';
import type { ProviderType } from '../../entities/resource-group.entity';

export class CreateResourceGroupDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(['LOCAL', 'AWS', 'GCP', 'AZURE'] as any)
  providerType: ProviderType;

  @IsOptional()
  @IsString()
  externalAddress?: string;

  @IsOptional()
  @IsString()
  pat?: string;
}
