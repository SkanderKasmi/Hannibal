import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthRmqController {
  constructor(private readonly auth: AuthService) {}

  @MessagePattern({ cmd: 'auth.validateToken' })
  validateToken(@Payload() data: { token: string }) {
    return this.auth.validateAccessToken(data.token);
  }
}
