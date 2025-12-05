// src/dtos/vm/execute-command.dto.ts
import { IsString } from 'class-validator';

export class ExecuteCommandDto {
  @IsString()
  vmId: string;

  @IsString()
  command: string;
}
