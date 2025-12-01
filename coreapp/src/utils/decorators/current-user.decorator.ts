/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/utils/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.currentUser || req.user || req.session?.user || null;
  },
);
