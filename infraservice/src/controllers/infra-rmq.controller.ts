// src/controllers/infra-rmq.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ResourceGroupService } from '../modules/resource-group/resource-group.service';
import { VmService } from '../modules/vm/vm.service';

@Controller()
export class InfraRmqController {
  constructor(
    private readonly rgService: ResourceGroupService,
    private readonly vmService: VmService,
  ) {}

  @MessagePattern({ cmd: 'infra.listResourceGroups' })
  listRgs() {
    return this.rgService.findAll();
  }

  @MessagePattern({ cmd: 'infra.getResourceGroupById' })
  getRg(@Payload() payload: { id: string }) {
    return this.rgService.findOne(payload.id);
  }

  @MessagePattern({ cmd: 'infra.getResourceGroupWithVms' })
  getRgWithVms(@Payload() payload: { id: string }) {
    return this.rgService.findOneWithVms(payload.id);
  }

  @MessagePattern({ cmd: 'infra.listVmsInResourceGroup' })
  listVmsInRg(@Payload() payload: { resourceGroupId: string }) {
    return this.rgService.listVmsInGroup(payload.resourceGroupId);
  }

  @MessagePattern({ cmd: 'infra.getVmById' })
  getVm(@Payload() payload: { id: string }) {
    return this.vmService.findOne(payload.id);
  }
}
