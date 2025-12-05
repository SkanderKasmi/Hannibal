// src/config/kafka.config.ts
import { KafkaOptions, Transport } from '@nestjs/microservices';
import { loadEnv } from '../env/env.loader';
import { MonitorSettings } from '../settings/monitor.settings';

const env = loadEnv();

export const kafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'monitor-service',
      brokers: [env.KAFKA_BROKER],
    },
    consumer: {
      groupId: 'monitor-service-group',
    },
    subscribe: {
      fromBeginning: false,
    },
  },
};
