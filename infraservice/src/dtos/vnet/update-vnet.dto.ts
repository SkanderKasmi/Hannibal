// src/dtos/vnet/update-vnet.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateVnetDto } from './create-vnet.dto';

export class UpdateVnetDto extends PartialType(CreateVnetDto) {}
