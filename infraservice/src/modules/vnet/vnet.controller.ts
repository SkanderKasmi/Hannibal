// src/modules/vnet/vnet.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { VnetService } from './vnet.service';
import { CreateVnetDto } from '../../dtos/vnet/create-vnet.dto';
import { UpdateVnetDto } from '../../dtos/vnet/update-vnet.dto';

@Controller('vnets')
export class VnetController {
  constructor(private readonly vnetService: VnetService) {}

  @Get()
  list() {
    return this.vnetService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.vnetService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateVnetDto) {
    return this.vnetService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVnetDto) {
    return this.vnetService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vnetService.remove(id);
  }
}
