// src/config/redis.config.ts
import { loadEnv } from '../env/env.loader';

const env = loadEnv();

export const redisConfig = {
  url: env.REDIS_URL || 'redis://redis:6379',
};
