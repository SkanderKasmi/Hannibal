// src/modules/vm/vm.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { VmService } from './vm.service';
import { CreateVmDto } from '../../dtos/vm/create-vm.dto';
import { UpdateVmDto } from '../../dtos/vm/update-vm.dto';
import { ExecuteCommandDto } from '../../dtos/vm/execute-command.dto';

@Controller('vms')
export class VmController {
  constructor(private readonly vmService: VmService) {}

  @Get()
  list() {
    return this.vmService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.vmService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateVmDto) {
    return this.vmService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVmDto) {
    return this.vmService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vmService.remove(id);
  }

  @Post('execute')
  execute(@Body() dto: ExecuteCommandDto) {
    return this.vmService.executeCommand(dto);
  }
}
