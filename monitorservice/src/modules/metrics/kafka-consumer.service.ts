import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, EachMessagePayload } from 'kafkajs';
import { MonitorSettings } from '../../settings/monitor.settings';
import { DataEngineeringService } from './data-engineering.service';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] });
  private consumer = this.kafka.consumer({ groupId: 'monitor-group' });

  constructor(private readonly dataService: DataEngineeringService) {}

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: MonitorSettings.METRICS_TOPIC });
    await this.consumer.run({
      eachMessage: async ({ message }: EachMessagePayload) => {
        if (!message.value) return;
        const raw = JSON.parse(message.value.toString());
        await this.dataService.processMetric(raw);
      },
    });
  }
}
