import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MonitorGatewayService {
  constructor(
    @Inject('MONITOR_SERVICE') private readonly monitorClient: ClientProxy,
  ) {}

  getVmLive(vmId: string) {
    const res$ = this.monitorClient.send(
      { cmd: 'monitor.getVmLive' },
      { vmId },
    );
    return firstValueFrom(res$);
  }

  getVmHistory(vmId: string) {
    const res$ = this.monitorClient.send(
      { cmd: 'monitor.getVmHistory' },
      { vmId },
    );
    return firstValueFrom(res$);
  }

  generateVmReport(vmId: string, format: 'PDF' | 'XLSX', requestedBy: string) {
    const res$ = this.monitorClient.send(
      { cmd: 'monitor.generateVmReport' },
      { vmId, format, requestedBy },
    );
    return firstValueFrom(res$);
  }
}