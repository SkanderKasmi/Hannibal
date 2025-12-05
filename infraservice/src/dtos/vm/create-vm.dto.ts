// src/dtos/vm/create-vm.dto.ts
import {
  IsEnum,
  IsIP,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import type { VmAuthType, VmConnectionType } from '../../entities/vm.entity';

export class CreateVmDto {
  @IsString()
  resourceGroupId: string;

  @IsString()
  name: string;

  @IsString()
  hostname: string;

  @IsIP()
  ipAddress: string;

  @IsNumber()
  sshPort: number;

  @IsEnum(['SSH', 'GRPC', 'HTTPS'] as any)
  connectionType: VmConnectionType;

  @IsEnum(['PASSWORD', 'KEY'] as any)
  authType: VmAuthType;

  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  publicKey?: string;
}
