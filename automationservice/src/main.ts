// src/main.ts
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AutomationExceptionFilter } from './validation/filters/automation-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { rmqServerOptions } from './config/rmq.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new AutomationExceptionFilter());

  // RMQ microservice (for receiving commands and job results)
  app.connectMicroservice(rmqServerOptions);
  await app.startAllMicroservices();

  const port = Number(process.env.PORT || 3005);
  await app.listen(port);
  console.log(`Automation service listening on port ${port}`);
}
bootstrap();
