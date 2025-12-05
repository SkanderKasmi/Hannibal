// authservice/src/config/db.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { ensurePostgresDatabase } from '../config/db-init.util';

export async function buildAuthDbConfig(): Promise<TypeOrmModuleOptions> {
  const host = process.env.DB_HOST || 'postgres';
  const port = Number(process.env.DB_PORT || 5432);
  const username = process.env.DB_USER || 'postgres';
  const password = process.env.DB_PASSWORD || 'postgres';
  const database = process.env.DB_NAME || 'auth_db';

  await ensurePostgresDatabase({ host, port, user: username, password, database });

  return {
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    entities: [User, RefreshToken],
    synchronize: true, // ❗disable in real prod
  };
}
