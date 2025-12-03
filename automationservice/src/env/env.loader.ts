// src/env/env.loader.ts
export interface AutomationEnv {
  RABBITMQ_URL: string;
  REDIS_URL?: string;
  KAFKA_BROKER?: string;
}

export function loadEnv(): AutomationEnv {
  return {
    RABBITMQ_URL:
      process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672',
    REDIS_URL: process.env.REDIS_URL,
    KAFKA_BROKER: process.env.KAFKA_BROKER,
  };
}
