
// src/dtos/auth/signup.dto.ts
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  password: string;

  @IsOptional()
  @IsString({ each: true })
  roles?: string[];
}
