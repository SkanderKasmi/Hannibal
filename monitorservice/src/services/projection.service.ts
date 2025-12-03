// src/services/projection.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { MetricsSnapshot } from '../entities/metrics-snapshot.entity';

export type ProjectionMetric =
  | 'cpuLoad'
  | 'memoryUsagePercent'
  | 'diskUsedPercent'
  | 'networkRx'
  | 'networkTx';

export interface TimeseriesPoint {
  timestamp: Date;
  value: number;
}

export interface ProjectionResult {
  metric: ProjectionMetric;
  vmId?: string;
  resourceGroupId?: string;
  horizonMinutes: number;
  historical: TimeseriesPoint[];
  projected: TimeseriesPoint[];
}

/**
 * ProjectionService:
 * - Reads historical metrics from metrics_snapshots
 * - Builds simple linear regression over time
 * - Projects the metric into the future (e.g. next 60 minutes)
 */
@Injectable()
export class ProjectionService {
  private readonly logger = new Logger(ProjectionService.name);

  constructor(
    @InjectRepository(MetricsSnapshot)
    private readonly snapshotRepo: Repository<MetricsSnapshot>,
  ) {}

  /**
   * Get raw timeseries for a VM between two dates.
   */
  async getVmTimeseries(
    vmId: string,
    metric: ProjectionMetric,
    from: Date,
    to: Date,
    limit = 500,
  ): Promise<TimeseriesPoint[]> {
    const snapshots = await this.snapshotRepo.find({
      where: {
        vmId,
        timestamp: Between(from, to),
      },
      order: { timestamp: 'ASC' },
      take: limit,
    });

    return snapshots
      .map((s) => ({
        timestamp: s.timestamp,
        value: this.readMetricValue(s, metric),
      }))
      .filter((p) => Number.isFinite(p.value));
  }

  /**
   * Projection for a single VM metric into the future.
   */
  async projectVmMetric(
    vmId: string,
    metric: ProjectionMetric,
    horizonMinutes: number,
    lookbackMinutes = 60,
  ): Promise<ProjectionResult> {
    const now = new Date();
    const from = new Date(now.getTime() - lookbackMinutes * 60_000);

    const historical = await this.getVmTimeseries(
      vmId,
      metric,
      from,
      now,
    );

    if (historical.length < 2) {
      this.logger.warn(
        `Not enough data to project ${metric} for VM ${vmId}`,
      );
      return {
        metric,
        vmId,
        horizonMinutes,
        historical,
        projected: [],
      };
    }

    const { slope, intercept } = this.linearRegression(historical, now);

    const projected: TimeseriesPoint[] = [];
    const stepMinutes = 5; // projection step granularity
    const steps = Math.ceil(horizonMinutes / stepMinutes);

    for (let i = 1; i <= steps; i++) {
      const t = new Date(now.getTime() + i * stepMinutes * 60_000);
      const minutesFromNow = i * stepMinutes;
      const x = minutesFromNow; // minutes as x
      let value = slope * x + intercept;

      // clamp to sane bounds if it's a percentage metric
      if (
        metric === 'cpuLoad' ||
        metric === 'memoryUsagePercent' ||
        metric === 'diskUsedPercent'
      ) {
        if (value < 0) value = 0;
        if (value > 100) value = 100;
      }

      projected.push({ timestamp: t, value: +value.toFixed(2) });
    }

    return {
      metric,
      vmId,
      horizonMinutes,
      historical,
      projected,
    };
  }

  /**
   * Projection for a resource-group metric, aggregating VM metrics.
   * For now: average of VM metrics in the group over time.
   */
  async projectResourceGroupMetric(
    resourceGroupId: string,
    metric: ProjectionMetric,
    horizonMinutes: number,
    lookbackMinutes = 60,
  ): Promise<ProjectionResult> {
    const now = new Date();
    const from = new Date(now.getTime() - lookbackMinutes * 60_000);

    const snapshots = await this.snapshotRepo.find({
      where: {
        resourceGroupId,
        timestamp: Between(from, now),
      },
      order: { timestamp: 'ASC' },
      take: 2000,
    });

    if (!snapshots.length) {
      return {
        metric,
        resourceGroupId,
        horizonMinutes,
        historical: [],
        projected: [],
      };
    }

    // group by timestamp minute and average
    const buckets = new Map<number, { sum: number; count: number; time: Date }>();

    for (const s of snapshots) {
      const value = this.readMetricValue(s, metric);
      if (!Number.isFinite(value)) continue;

      // bucket by minute
      const bucketTs = new Date(
        s.timestamp.getFullYear(),
        s.timestamp.getMonth(),
        s.timestamp.getDate(),
        s.timestamp.getHours(),
        s.timestamp.getMinutes(),
        0,
        0,
      );
      const key = bucketTs.getTime();

      const existing = buckets.get(key);
      if (!existing) {
        buckets.set(key, { sum: value, count: 1, time: bucketTs });
      } else {
        existing.sum += value;
        existing.count += 1;
      }
    }

    const historical: TimeseriesPoint[] = Array.from(buckets.values())
      .map((b) => ({
        timestamp: b.time,
        value: b.sum / b.count,
      }))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    if (historical.length < 2) {
      this.logger.warn(
        `Not enough data to project ${metric} for RG ${resourceGroupId}`,
      );
      return {
        metric,
        resourceGroupId,
        horizonMinutes,
        historical,
        projected: [],
      };
    }

    const { slope, intercept } = this.linearRegression(historical, now);

    const projected: TimeseriesPoint[] = [];
    const stepMinutes = 5;
    const steps = Math.ceil(horizonMinutes / stepMinutes);

    for (let i = 1; i <= steps; i++) {
      const t = new Date(now.getTime() + i * stepMinutes * 60_000);
      const minutesFromNow = i * stepMinutes;
      const x = minutesFromNow;
      let value = slope * x + intercept;

      if (
        metric === 'cpuLoad' ||
        metric === 'memoryUsagePercent' ||
        metric === 'diskUsedPercent'
      ) {
        if (value < 0) value = 0;
        if (value > 100) value = 100;
      }

      projected.push({ timestamp: t, value: +value.toFixed(2) });
    }

    return {
      metric,
      resourceGroupId,
      horizonMinutes,
      historical,
      projected,
    };
  }

  /**
   * Simple linear regression (least squares) over time series.
   * x = minutes from "now" (negative for past), y = value.
   */
  private linearRegression(
    points: TimeseriesPoint[],
    now: Date,
  ): { slope: number; intercept: number } {
    // Represent time as minutes relative to `now`
    const xs: number[] = [];
    const ys: number[] = [];

    for (const p of points) {
      const dtMs = p.timestamp.getTime() - now.getTime();
      const x = dtMs / 60_000; // minutes
      xs.push(x);
      ys.push(p.value);
    }

    const n = xs.length;
    if (n === 0) return { slope: 0, intercept: 0 };

    const sumX = xs.reduce((a, b) => a + b, 0);
    const sumY = ys.reduce((a, b) => a + b, 0);
    const sumXY = xs.reduce((acc, x, i) => acc + x * ys[i], 0);
    const sumX2 = xs.reduce((acc, x) => acc + x * x, 0);

    const denominator = n * sumX2 - sumX * sumX;
    if (denominator === 0) {
      // no variation in x → flat line
      const avgY = sumY / n;
      return { slope: 0, intercept: avgY };
    }

    const slope =
      (n * sumXY - sumX * sumY) / denominator;
    const intercept =
      (sumY - slope * sumX) / n;

    return { slope, intercept };
  }

  /**
   * Helper to safely read a metric from MetricsSnapshot.
   */
  private readMetricValue(
    s: MetricsSnapshot,
    metric: ProjectionMetric,
  ): number {
    switch (metric) {
      case 'cpuLoad':
        return s.cpuLoad ?? 0;
      case 'memoryUsagePercent':
        return s.memoryUsagePercent ?? 0;
      case 'diskUsedPercent':
        return s.diskUsedPercent ?? 0;
      case 'networkRx':
        return s.networkRx ?? 0;
      case 'networkTx':
        return s.networkTx ?? 0;
      default:
        return 0;
    }
  }
}
