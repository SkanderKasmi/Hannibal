import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetricsSnapshot } from '../../entities/metrics-snapshot.entity';

@Injectable()
export class MetricsSnapshotRepository {
  constructor(
    @InjectRepository(MetricsSnapshot)
    private readonly repo: Repository<MetricsSnapshot>,
  ) {}

  create(entity: Partial<MetricsSnapshot>) {
    return this.repo.create(entity);
  }

  async save(entity: MetricsSnapshot) {
    return this.repo.save(entity);
  }

  async findRecentForVm(vmId: string, limit = 100) {
    return this.repo.find({
      where: { vmId },
      order: { timestamp: 'DESC' },
      take: limit,
    });
  }

  async findRangeForVm(vmId: string, from: Date, to: Date) {
    return this.repo
      .createQueryBuilder('m')
      .where('m.vmId = :vmId', { vmId })
      .andWhere('m.timestamp BETWEEN :from AND :to', { from, to })
      .orderBy('m.timestamp', 'ASC')
      .getMany();
  }

  // add other helpers you need...
}
