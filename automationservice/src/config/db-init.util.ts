// src/config/db-init.util.ts
import { Client as PgClient } from 'pg';
import { createConnection as createMysqlConnection } from 'mysql2/promise';

export interface SqlDbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

/**
 * Ensure a Postgres database exists; create if missing.
 */
export async function ensurePostgresDatabase(config: SqlDbConfig) {
  const { host, port, user, password, database } = config;

  // connect to default "postgres" DB
  const client = new PgClient({
    host,
    port,
    user,
    password,
    database: 'postgres',
  });

  await client.connect();

  const exists = await client.query(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    [database],
  );

  if (exists.rowCount === 0) {
    console.log(`[DB-INIT] Creating Postgres database "${database}" ...`);
    await client.query(`CREATE DATABASE "${database}"`);
  } else {
    console.log(`[DB-INIT] Postgres database "${database}" already exists.`);
  }

  await client.end();
}

/**
 * Ensure a MySQL database exists; create if missing.
 */
export async function ensureMysqlDatabase(config: SqlDbConfig) {
  const { host, port, user, password, database } = config;

  const conn = await createMysqlConnection({
    host,
    port,
    user,
    password,
    multipleStatements: true,
  });

  console.log(`[DB-INIT] Creating MySQL database "${database}" if not exists...`);
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
  await conn.end();
}
