// src/config/typeorm.config.ts
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { createConnection } from 'mysql2/promise';

// Entities
import { ResourceGroup } from '../entities/resource-group.entity';
import { Vm } from '../entities/vm.entity';
import { VirtualNetwork } from '../entities/virtual-network.entity';

// Settings
import { InfraSettings } from '../settings/infra.settings';
import { loadEnv } from '../env/env.loader';

const env = loadEnv();

/**
 * Auto-create database if missing
 */
async function ensureDatabaseExists(dbName: string) {
  const connection = await createConnection({
    host: env.MYSQL_HOST,
    port: env.MYSQL_PORT,
    user: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
  });

  // Create database if missing
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
  await connection.end();
}

export const typeormConfig: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    const nodeEnv =
      config.get<string>('NODE_ENV') || env.NODE_ENV || 'development';

    // Determine DB name by environment
    let dbName = InfraSettings.DEFAULT_DB_DEV;
    if (nodeEnv === 'test') dbName = InfraSettings.DEFAULT_DB_TEST;
    if (nodeEnv === 'staging') dbName = InfraSettings.DEFAULT_DB_STAGING;
    if (nodeEnv === 'production') dbName = InfraSettings.DEFAULT_DB_PROD;

    // Ensure DB exists before connecting
    await ensureDatabaseExists(dbName);

    return {
      type: 'mysql' as const,
      host: env.MYSQL_HOST,
      port: env.MYSQL_PORT,
      username: env.MYSQL_USER,
      password: env.MYSQL_PASSWORD,
      database: dbName,
      entities: [ResourceGroup, Vm, VirtualNetwork],
      synchronize: true, // ⚠️ disable in production
      autoLoadEntities: true,
    };
  },
};
