import { Module } from '@nestjs/common';
import { InfraBridgeService } from './infra-bridge.service';

@Module({
  providers: [InfraBridgeService],
  exports: [InfraBridgeService],
})
export class InfraBridgeModule {}
