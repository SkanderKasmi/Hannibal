// src/dtos/deploy-agent.dto.ts
import { IsString } from 'class-validator';

export class DeployAgentDto {
  @IsString()
  resourceGroupId: string;

  @IsString()
  requestedBy: string;
}
