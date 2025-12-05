// src/modules/resource-group/resource-group.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { ResourceGroupService } from './resource-group.service';
import { CreateResourceGroupDto } from '../../dtos/resource-group/create-resource-group.dto';
import { UpdateResourceGroupDto } from '../../dtos/resource-group/update-resource-group.dto';
import { ResourceGroupValidationPipe } from '../../validation/pipes/resource-group-validation.pipe';

@Controller('resource-groups')
export class ResourceGroupController {
  constructor(private readonly rgService: ResourceGroupService) {}

  @Get()
  list() {
    return this.rgService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.rgService.findOne(id);
  }

  @Post()
  @UsePipes(ResourceGroupValidationPipe)
  create(@Body() dto: CreateResourceGroupDto) {
    return this.rgService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateResourceGroupDto) {
    return this.rgService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rgService.remove(id);
  }

  @Get(':id/vms')
  listVms(@Param('id') id: string) {
    return this.rgService.listVmsInGroup(id);
  }
}
