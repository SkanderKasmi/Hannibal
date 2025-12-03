import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import { rmqServerOptions } from './config/rmq.config';
import { ReportExceptionFilter } from './validation/filters/report-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new ReportExceptionFilter());

  // Microservice for RMQ (report.build, etc.)
  app.connectMicroservice(rmqServerOptions);
  await app.startAllMicroservices();

  const port = Number(process.env.PORT || 3006);
  await app.listen(port);
  console.log(`ReportService listening on port ${port}`);
}
bootstrap();
