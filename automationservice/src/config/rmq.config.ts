// src/config/rmq.config.ts
import { Transport, RmqOptions, ClientOptions } from '@nestjs/microservices';
import { loadEnv } from '../env/env.loader';

const env = loadEnv();

export const rmqServerOptions: RmqOptions = {
  transport: Transport.RMQ,
  options: {
    urls: [env.RABBITMQ_URL],
    queue: 'automation-service',
    queueOptions: { durable: true },
  },
};

export const agentClientOptions: ClientOptions = {
  transport: Transport.RMQ,
  options: {
    urls: [env.RABBITMQ_URL],
    queue: 'agent-service',
    queueOptions: { durable: true },
  },
};
