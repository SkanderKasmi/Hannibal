// src/config/redis.config.ts
import { loadEnv } from '../env/env.loader';

const env = loadEnv();

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
}

export const redisConfig: RedisConfig = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
};
