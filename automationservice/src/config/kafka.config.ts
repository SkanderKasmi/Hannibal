// src/config/kafka.config.ts
import { loadEnv } from '../env/env.loader';

const env = loadEnv();

export const kafkaConfig = {
  brokers: [env.KAFKA_BROKER || 'kafka:9092'],
};
