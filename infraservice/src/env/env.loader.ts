// src/env/env.loader.ts
export interface InfraEnv {
  NODE_ENV: string;
  PORT: number;
  MYSQL_HOST: string;
  MYSQL_PORT: number;
  MYSQL_USER: string;
  MYSQL_PASSWORD: string;
  RABBITMQ_URL: string;
}

export function loadEnv(): InfraEnv {
  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: +(process.env.PORT || 3001),
    MYSQL_HOST: process.env.MYSQL_HOST || 'localhost',
    MYSQL_PORT: +(process.env.MYSQL_PORT || 3306),
    MYSQL_USER: process.env.MYSQL_USER || 'root',
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || 'root',
    RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672',
  };
}
