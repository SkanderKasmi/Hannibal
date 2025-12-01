// src/validation/filters/agent-exception.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AgentLogger } from '../../utils/logger.util';

@Catch()
export class AgentExceptionFilter implements ExceptionFilter {
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
        : exception?.message || 'Internal error';

    AgentLogger.error(
      `Error ${status} on ${req.method} ${req.url}: ${
        exception?.stack || message
      }`,
    );

    res.status(status).json({
      statusCode: status,
      path: req.url,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
