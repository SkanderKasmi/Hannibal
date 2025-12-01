// src/env/env.loader.ts
export interface AgentEnv {
  NODE_ENV: string;
  PORT: number;
  RABBITMQ_URL: string;
}

export function loadEnv(): AgentEnv {
  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: +(process.env.PORT || 3003),
    RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672',
  };
}
