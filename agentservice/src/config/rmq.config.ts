// src/config/rmq.config.ts
import { loadEnv } from '../env/env.loader';
import { ClientOptions, Transport } from '@nestjs/microservices';

const env = loadEnv();

export const agentRmqOptions: ClientOptions = {
  transport: Transport.RMQ,
  options: {
    urls: [env.RABBITMQ_URL],
    queue: 'agent-service',
    queueOptions: { durable: true },
  },
};

export const infraClientOptions: ClientOptions = {
  transport: Transport.RMQ,
  options: {
    urls: [env.RABBITMQ_URL],
    queue: 'infra-service',
    queueOptions: { durable: true },
  },
};

export const automationClientOptions: ClientOptions = {
  transport: Transport.RMQ,
  options: {
    urls: [env.RABBITMQ_URL],
    queue: 'automation-service',
    queueOptions: { durable: true },
  },
};
