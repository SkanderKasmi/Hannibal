import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthExceptionFilter } from './validation/filters/auth-exception.filter';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import { rmqServerOptions } from './config/rmq.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AuthExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );

  // RMQ microservice for token validation
  app.connectMicroservice<MicroserviceOptions>(rmqServerOptions);
  await app.startAllMicroservices();

  const port = Number(process.env.PORT || 3000);
  await app.listen(port);
  Logger.log(`AuthService listening on port ${port}`);
}
bootstrap();
