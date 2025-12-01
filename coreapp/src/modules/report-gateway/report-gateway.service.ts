// src/report/report-gateway.service.ts
import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthGatewayService } from 'src/modules/auth-gateway/auth-gateway.service';

@Injectable()
export class ReportGatewayService {
  constructor(
    @Inject('REPORT_SERVICE') private readonly reportClient: ClientProxy,
    private readonly authGateway: AuthGatewayService,
  ) {}

  async listReports(userId: string) {
    const allowed = await this.authGateway.checkPermission(
      userId,
      'REPORT_LIST',
      'GLOBAL',
      '*',
    );
    if (!allowed) throw new ForbiddenException('No permission to list reports');

    const res$ = this.reportClient.send({ cmd: 'report.list' }, {});
    return firstValueFrom(res$);
  }

  async getReport(userId: string, id: string) {
    const allowed = await this.authGateway.checkPermission(
      userId,
      'REPORT_READ',
      'REPORT',
      id,
    );
    if (!allowed) throw new ForbiddenException('No permission to read report');

    const res$ = this.reportClient.send({ cmd: 'report.get' }, { id });
    return firstValueFrom(res$);
  }
}
