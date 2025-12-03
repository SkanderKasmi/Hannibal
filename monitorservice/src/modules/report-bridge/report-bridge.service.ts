import { Injectable } from '@nestjs/common';
import { GenerateReportDto } from '../../dtos/generate-report.dto';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class ReportBridgeService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
        queue: 'report_queue',
        queueOptions: { durable: true },
      },
    });
  }

  async generateReport(dto: GenerateReportDto) {
    return this.client.send({ cmd: 'report.generate' }, dto).toPromise();
  }
}
