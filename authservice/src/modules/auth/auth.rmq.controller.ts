// authservice/src/modules/auth/auth.rmq.controller.ts (example name)
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthRmqController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'auth.validateToken' })
  async validateToken(@Payload() data: { token: string }) {
    return this.authService.validateAccessToken(data.token);
  }
}
