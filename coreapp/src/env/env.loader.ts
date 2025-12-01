// src/env/env.loader.ts
export interface AppEnv {
  NODE_ENV: string;
  PORT: number;
  SESSION_SECRET: string;
  CORS_ORIGIN: string;
  JWT_SECRET: string;
  RABBITMQ_URL: string;
}

export function loadEnv(): AppEnv {
  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: +(process.env.PORT || 3000),
    SESSION_SECRET: process.env.SESSION_SECRET || 'dev-secret',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:4200',
    JWT_SECRET: process.env.JWT_SECRET || 'dev-jwt-secret',
    RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  };
}
