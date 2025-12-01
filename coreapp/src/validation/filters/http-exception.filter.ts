// src/validation/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CoreLogger } from '../../utils/logger.util';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception?.message || 'Internal server error';

    CoreLogger.error(
      `Error ${status} on ${req.method} ${req.url}: ${
        exception?.stack || message
      }`,
    );

    res.status(status).send({
      statusCode: status,
      path: req.url,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
