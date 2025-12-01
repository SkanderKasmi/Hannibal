/* eslint-disable @typescript-eslint/no-floating-promises */
// src/main.ts
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import fastifyCsrf from '@fastify/csrf-protection';
import fastifyHelmet from '@fastify/helmet';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './validation/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  const PORT = process.env.PORT || 3000;
  const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret';

  await app.register(fastifyHelmet);
  await app.register(fastifyCookie);
  await app.register(fastifySession, {
    secret: SESSION_SECRET,
    cookie: {
      secure: false, // set true behind HTTPS in prod
      httpOnly: true,
      sameSite: 'lax',
    },
  });
  await app.register(fastifyCsrf);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Core Gateway')
    .setDescription('API Gateway for Infra, Monitor, Report, Agent, Auth')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(PORT, '0.0.0.0');
  console.log(`Core app gateway running on http://localhost:${PORT}`);
}
bootstrap();
