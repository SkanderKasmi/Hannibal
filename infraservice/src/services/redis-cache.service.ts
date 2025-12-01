// src/services/redis-cache.service.ts
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis, { Redis as RedisClient } from 'ioredis';
import { redisConfig } from '../config/redis.config';

@Injectable()
export class RedisCacheService implements OnModuleDestroy {
  private client: RedisClient;

  constructor() {
    this.client = new Redis({
      host: redisConfig.host,
      port: redisConfig.port,
      password: redisConfig.password,
    });
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async get<T = any>(key: string): Promise<T | null> {
    const raw = await this.client.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as any;
    }
  }

  async set(
    key: string,
    value: any,
    ttlSeconds = 60,
  ): Promise<void> {
    const payload =
      typeof value === 'string' ? value : JSON.stringify(value);
    if (ttlSeconds > 0) {
      await this.client.set(key, payload, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, payload);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}
