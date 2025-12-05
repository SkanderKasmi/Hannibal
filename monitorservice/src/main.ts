// monitorservice/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MonitorExceptionFilter } from './validation/filters/monitor-exception.filter';
import { loadEnv } from './env/env.loader';
import { kafkaConfig } from './config/kafka.config';
import { rmqConfig } from './config/rmq.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new MonitorExceptionFilter());

  // Microservices
  app.connectMicroservice(kafkaConfig); // Kafka consumer
  app.connectMicroservice(rmqConfig);   // RPC for report/core/agent

  await app.startAllMicroservices();
  
  const env = loadEnv();
  await app.listen(env.PORT);
  console.log(`Monitor Service running at http://localhost:${env.PORT}`);
}
bootstrap();
