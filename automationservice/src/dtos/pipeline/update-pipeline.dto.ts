// src/dtos/pipeline/update-pipeline.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePipelineDto } from './create-pipeline.dto';

export class UpdatePipelineDto extends PartialType(CreatePipelineDto) {}
