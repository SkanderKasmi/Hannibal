/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/validation/pipes/validation.pipe.ts
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.requiresValidation(metatype)) {
      return value;
    }
    const obj = plainToInstance(metatype, value);
    const errors = await validate(obj);
    if (errors.length > 0) {
      throw new BadRequestException(errors.map((e) => Object.values(e.constraints || {})).flat());
    }
    return obj;
  }

  private requiresValidation(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
