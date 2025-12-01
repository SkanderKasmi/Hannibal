import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { AggregatedMetric } from '../../interfaces/metrics/aggregated-metric.interface';
import { MonitorSettings } from '../../settings/monitor.settings';
import { redisConfig } from '../../config/redis.config';

@Injectable()
export class MetricsStoreService {
  private readonly logger = new Logger(MetricsStoreService.name);
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis(redisConfig);
  }

  /**
   * Save an aggregated metric to Redis with TTL
   */
  async save(metric: AggregatedMetric): Promise<void> {
    try {
      const key = `metrics:${metric.vmId}`;
      const value = JSON.stringify(metric);
      
      // Store as a list (LPUSH) and trim to keep only recent metrics
      await this.redis.lpush(key, value);
      await this.redis.ltrim(key, 0, 99); // Keep last 100 metrics
      await this.redis.expire(key, MonitorSettings.METRIC_TTL);
      
      this.logger.debug(`Saved metric for VM ${metric.vmId}`);
    } catch (error) {
      this.logger.error(`Failed to save metric for VM ${metric.vmId}`, error.stack);
      throw error;
    }
  }

  /**
   * Get recent metrics for a VM
   */
  async getRecent(vmId: string, limit: number = 50): Promise<AggregatedMetric[]> {
    try {
      const key = `metrics:${vmId}`;
      const values = await this.redis.lrange(key, 0, limit - 1);
      return values.map(v => JSON.parse(v) as AggregatedMetric);
    } catch (error) {
      this.logger.error(`Failed to get metrics for VM ${vmId}`, error.stack);
      return [];
    }
  }

  /**
   * Get the latest metric for a VM
   */
  async getLatest(vmId: string): Promise<AggregatedMetric | null> {
    try {
      const key = `metrics:${vmId}`;
      const values = await this.redis.lrange(key, 0, 0);
      if (values.length === 0) return null;
      return JSON.parse(values[0]) as AggregatedMetric;
    } catch (error) {
      this.logger.error(`Failed to get latest metric for VM ${vmId}`, error.stack);
      return null;
    }
  }

  /**
   * Get all metrics for a VM
   */
  async getAll(vmId: string): Promise<AggregatedMetric[]> {
    try {
      const key = `metrics:${vmId}`;
      const values = await this.redis.lrange(key, 0, -1);
      return values.map(v => JSON.parse(v) as AggregatedMetric);
    } catch (error) {
      this.logger.error(`Failed to get all metrics for VM ${vmId}`, error.stack);
      return [];
    }
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
