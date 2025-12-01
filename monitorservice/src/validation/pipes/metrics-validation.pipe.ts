import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { GetMetricsDto } from '../../dtos/get-metrics.dto';

@Injectable()
export class MetricsValidationPipe implements PipeTransform {
  transform(value: GetMetricsDto) {
    if (!value.vmId && !value.resourceGroupId) {
      throw new BadRequestException('Either vmId or resourceGroupId must be provided');
    }
    return value;
  }
}
