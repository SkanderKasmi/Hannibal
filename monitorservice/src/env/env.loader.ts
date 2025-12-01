// src/env/env.loader.ts
export interface MonitorEnv {
  NODE_ENV: string;
  PORT: number;
  MONGO_URI: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  RABBITMQ_URL: string;
  KAFKA_BROKER: string;
}

export function loadEnv() {
  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: Number(process.env.PORT) || 3004,
    MONGO_URI: process.env.MONGO_URI || 'mongodb://mongo:27017/monitor',
    REDIS_HOST: process.env.REDIS_HOST || 'redis',
    REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
    KAFKA_BROKER: process.env.KAFKA_BROKER || 'kafka:9092',
    RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672',
  };
}
