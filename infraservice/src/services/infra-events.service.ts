// src/services/infra-events.service.ts
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class InfraEventsService {
  private readonly logger = new Logger(InfraEventsService.name);

  async emitVmCreated(vmId: string) {
    // Later: emit event to Kafka/RabbitMQ
    this.logger.log(`VM created: ${vmId}`);
  }
}
