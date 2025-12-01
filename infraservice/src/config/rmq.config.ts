// src/config/rmq.config.ts
import { loadEnv } from '../env/env.loader';

const env = loadEnv();

export const rmqOptions = {
  urls: [env.RABBITMQ_URL],
  queue: 'infra-service',
  queueOptions: { durable: true },
};
