// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { APP_GUARD } from '@nestjs/core';
import { RmqClientsModule } from './common/rmq-clients.module';

import { JwtStrategy } from './security/jwt.strategy';
import { SessionGuard } from './security/session.guard';
import { HealthModule } from './health/health.module';
import { InfraGatewayModule } from './modules/infra-gateway/infra-gateway.module';
import { MonitorGatewayModule } from './modules/monitor-gateway/monitor-gateway.module';
import { ReportGatewayModule } from './modules/report-gateway/report-gateway.module';
import { AuthGatewayModule } from './modules/auth-gateway/auth-gateway.module';
import { AgentGatewayModule } from './modules/agent-gateway/agent-gateway.module';
import { RootController } from './controllers/root.controller';
import { RootResolver } from './graphql/root.resolver'; // ⬅️ NEW

@Module({
  controllers: [RootController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env',
      ],
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 100,
      },
    ]),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req, res }) => ({ req, res }),
      // playground/introspection you can tune later
    }),

    RmqClientsModule,
    InfraGatewayModule,
    MonitorGatewayModule,
    ReportGatewayModule,
    AgentGatewayModule,
    AuthGatewayModule,
    HealthModule,
  ],
  providers: [
    JwtStrategy,
    RootResolver, // ⬅️ NEW
    {
      provide: APP_GUARD,
      useClass: SessionGuard,
    },
  ],
})
export class AppModule {}
