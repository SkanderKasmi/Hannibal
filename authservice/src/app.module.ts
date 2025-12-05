import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvLoader } from './env/env.loader';
import { TypeOrmModule } from '@nestjs/typeorm';
import { buildAuthDbConfig,  } from './config/db.config';
import { User } from './entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvLoader],
    }),
  TypeOrmModule.forRootAsync({
      useFactory: async () => buildAuthDbConfig(),
    }),
    TypeOrmModule.forFeature([User, RefreshToken]),
    AuthModule,
    HealthModule,
  ],
})
export class AppModule {}
