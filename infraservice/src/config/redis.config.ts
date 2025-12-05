// src/config/redis.config.ts
export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
}

export const redisConfig: RedisConfig = {
  host: process.env.REDIS_HOST || 'redis',
  port: +(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD,
};
