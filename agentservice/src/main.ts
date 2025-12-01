// src/main.ts
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AgentExceptionFilter } from './validation/pipes/agent-exception.filter';
import { agentRmqOptions } from './config/rmq.config';
import { loadEnv } from './env/env.loader';

async function bootstrap() {
  const env = loadEnv();
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new AgentExceptionFilter());

  app.connectMicroservice(agentRmqOptions);

  await app.startAllMicroservices();
  await app.listen(env.PORT);
  console.log(`Agent service running on http://localhost:${env.PORT}`);
}
bootstrap();
