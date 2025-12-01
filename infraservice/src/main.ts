
// src/main.ts
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { InfraExceptionFilter } from './validation/filters/infra-exception.filter';
import { rmqOptions } from './config/rmq.config';
import { loadEnv } from './env/env.loader';
import { setupTracing } from './otel/otel-tracing';

async function bootstrap() {
  await setupTracing();  // ⬅️ start OTEL before Nest

  const env = loadEnv();
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new InfraExceptionFilter());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: rmqOptions,
  });

  await app.startAllMicroservices();
  await app.listen(env.PORT);
  console.log(`Infra service running on http://localhost:${env.PORT}`);
}
bootstrap();
