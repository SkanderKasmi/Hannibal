import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Client as PgClient } from 'pg';
import { MetricsSnapshot } from '../entities/metrics-snapshot.entity';

async function ensurePostgresDatabase(opts: {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}) {
  const { host, port, user, password, database } = opts;

  const client = new PgClient({
    host,
    port,
    user,
    password,
    database: 'postgres',
  });

  await client.connect();

  const res = await client.query(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    [database],
  );

  if (res.rowCount === 0) {
    console.log(`[DB-INIT] Creating Postgres database "${database}" for monitorservice...`);
    await client.query(`CREATE DATABASE "${database}"`);
  } else {
    console.log(`[DB-INIT] Postgres database "${database}" already exists.`);
  }

  await client.end();
}

export const typeormConfig: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    const host = config.get<string>('DB_HOST') || 'postgres';
    const port = Number(config.get<string>('DB_PORT') || '5432');
    const username = config.get<string>('DB_USER') || 'postgres';
    const password = config.get<string>('DB_PASSWORD') || 'postgres';
    const database = config.get<string>('DB_NAME') || 'monitor_db';

    await ensurePostgresDatabase({ host, port, user: username, password, database });

    return {
      type: 'postgres' as const,
      host,
      port,
      username,
      password,
      database,
      entities: [MetricsSnapshot],
      synchronize: true, // disable in real prod
      autoLoadEntities: true,
    };
  },
};
