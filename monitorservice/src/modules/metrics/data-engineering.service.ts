import { Injectable } from '@nestjs/common';
import { FilteringService } from './filtering.service';
import { CalculationService } from './calculation.service';
import { MetricsStoreService } from './metrics-store.service';
import { LiveStreamService } from './live-stream.service';

@Injectable()
export class DataEngineeringService {
  constructor(
    private readonly filter: FilteringService,
    private readonly calc: CalculationService,
    private readonly store: MetricsStoreService,
    private readonly liveStream: LiveStreamService,
  ) {}

  async processMetric(raw: any) {
    const cleaned = this.filter.clean(raw);
    const enriched = this.calc.enrich(cleaned);
    await this.store.save(enriched);
    this.liveStream.emit(enriched);
  }
}
