import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import type { UserRole } from '../entities/user.entity';

export class RegisterDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(['admin', 'developer', 'viewer'] as const)
  role?: UserRole;
}
