import { Injectable } from '@nestjs/common';
import { CleanMetric } from '../../interfaces/metrics/clean-metric.interface';
import { AggregatedMetric } from '../../interfaces/metrics/aggregated-metric.interface';

@Injectable()
export class CalculationService {

  /**
   * Aggregate metrics over a list of clean metrics
   */
  aggregate(metrics: CleanMetric[]): AggregatedMetric {
    const count = metrics.length;
    if (count === 0) return this.emptyAggregate();

    const sum = metrics.reduce((acc, m) => {
      acc.cpu += m.cpu;
      acc.gpu += m.gpu;
      acc.ram += m.ram;
      acc.disk += m.disk;
      acc.networkIn += m.networkIn;
      acc.networkOut += m.networkOut;
      return acc;
    }, this.emptyAggregate());

    return {
      vmId: metrics[0].vmId,
      timestamp: Date.now(),
      cpuAvg: +(sum.cpu / count).toFixed(2),
      gpuAvg: +(sum.gpu / count).toFixed(2),
      ramAvg: +(sum.ram / count).toFixed(2),
      diskAvg: +(sum.disk / count).toFixed(2),
      networkInAvg: +(sum.networkIn / count).toFixed(2),
      networkOutAvg: +(sum.networkOut / count).toFixed(2),
      totalLogs: metrics.reduce((acc, m) => acc + m.logs.length, 0),
      totalTasks: metrics.reduce((acc, m) => acc + m.tasks.length, 0),
    };
  }

  /**
   * Enrich a single clean metric by calculating derived values
   */
  enrich(metric: CleanMetric): AggregatedMetric {
    return {
      vmId: metric.vmId,
      timestamp: metric.timestamp,
      cpuAvg: metric.cpu,
      gpuAvg: metric.gpu,
      ramAvg: metric.ram,
      diskAvg: metric.disk,
      networkInAvg: metric.networkIn,
      networkOutAvg: metric.networkOut,
      totalLogs: metric.logs.length,
      totalTasks: metric.tasks.length,
    };
  }

  private emptyAggregate(): AggregatedMetric {
    return {
      vmId: '',
      timestamp: 0,
      cpuAvg: 0,
      gpuAvg: 0,
      ramAvg: 0,
      diskAvg: 0,
      networkInAvg: 0,
      networkOutAvg: 0,
      totalLogs: 0,
      totalTasks: 0,
    };
  }
}
