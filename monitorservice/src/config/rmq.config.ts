// src/config/rmq.config.ts
import { RmqOptions, Transport } from '@nestjs/microservices';
import { loadEnv } from '../env/env.loader';

const env = loadEnv();

export const monitorRmqOptions: RmqOptions = {
  transport: Transport.RMQ,
  options: {
    urls: [env.RABBITMQ_URL],
    queue: 'monitor-service',
    queueOptions: { durable: true },
  },
};

export const infraClientOptions = {
  transport: Transport.RMQ,
  options: {
    urls: [env.RABBITMQ_URL],
    queue: 'infra-service',
    queueOptions: { durable: true },
  },
};
