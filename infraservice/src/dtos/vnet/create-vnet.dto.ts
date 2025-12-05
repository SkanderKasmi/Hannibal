// src/dtos/vnet/create-vnet.dto.ts
import { IsBoolean, IsString } from 'class-validator';

export class CreateVnetDto {
  @IsString()
  resourceGroupId: string;

  @IsString()
  name: string;

  @IsString()
  cidr: string;

  @IsBoolean()
  active: boolean;
}
