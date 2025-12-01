// src/config/typeorm.config.ts
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ResourceGroup } from '../entities/resource-group.entity';
import { Vm } from '../entities/vm.entity';
import { VirtualNetwork } from '../entities/virtual-network.entity';
import { InfraSettings } from '../settings/infra.settings';
import { loadEnv } from '../env/env.loader';

const env = loadEnv();

export const typeormConfig: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const nodeEnv = config.get<string>('NODE_ENV') || env.NODE_ENV;

    let dbName = InfraSettings.DEFAULT_DB_DEV;
    if (nodeEnv === 'test') dbName = InfraSettings.DEFAULT_DB_TEST;
    if (nodeEnv === 'staging') dbName = InfraSettings.DEFAULT_DB_STAGING;
    if (nodeEnv === 'production') dbName = InfraSettings.DEFAULT_DB_PROD;

    return {
      type: 'mysql' as const,
      host: env.MYSQL_HOST,
      port: env.MYSQL_PORT,
      username: env.MYSQL_USER,
      password: env.MYSQL_PASSWORD,
      database: dbName,
      entities: [ResourceGroup, Vm, VirtualNetwork],
      synchronize: true, // turn off in real prod
    };
  },
};
