/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { InfraGatewayService } from './infra-gateway.service';
import { SessionGuard } from 'src/security/session.guard';


@Controller('infra')
@UseGuards(SessionGuard)
export class InfraController {
  constructor(private readonly infra: InfraGatewayService) {}

  private getUserId(req: any): string {
    return req.currentUser?.id || req.user?.id || req.session?.user?.id || 'anonymous';
  }

  @Get('resource-groups')
  listRgs(@Req() req: any) {
    return this.infra.listResourceGroups(this.getUserId(req));
  }

  @Get('resource-groups/:id')
  getRg(@Param('id') id: string, @Req() req: any) {
    return this.infra.getResourceGroupById(this.getUserId(req), id);
  }

  @Get('vms/:id')
  getVm(@Param('id') id: string, @Req() req: any) {
    return this.infra.getVmById(this.getUserId(req), id);
  }
}