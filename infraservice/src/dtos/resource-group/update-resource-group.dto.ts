// src/dtos/resource-group/update-resource-group.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateResourceGroupDto } from './create-resource-group.dto';

export class UpdateResourceGroupDto extends PartialType(
  CreateResourceGroupDto,
) {}
