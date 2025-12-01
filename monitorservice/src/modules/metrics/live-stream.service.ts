import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AggregatedMetric } from '../../interfaces/metrics/aggregated-metric.interface';

@Injectable()
export class LiveStreamService {
  private metrics$ = new Subject<AggregatedMetric>();
  private latestMetrics: Map<string, AggregatedMetric> = new Map();

  emit(metric: AggregatedMetric) {
    this.latestMetrics.set(metric.vmId, metric);
    this.metrics$.next(metric);
  }

  stream(query: { vmId?: string; resourceGroupId?: string }): Observable<AggregatedMetric> {
    return this.metrics$.asObservable().pipe(
      filter(metric => {
        if (query.vmId && metric.vmId !== query.vmId) return false;
        return true;
      }),
    );
  }

  getLatest(vmId: string): AggregatedMetric | undefined {
    return this.latestMetrics.get(vmId);
  }
}
