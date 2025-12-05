import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ensurePostgresDatabase } from './db-init.util';
import { Pipeline } from '../entities/pipeline.entity';
import { Job } from '../entities/job.entity';
import { Task } from '../entities/task.entity';

export async function buildAutomationDbConfig(): Promise<TypeOrmModuleOptions> {
  const host = process.env.DB_HOST || 'postgres';
  const port = Number(process.env.DB_PORT || 5432);
  const username = process.env.DB_USER || 'postgres';
  const password = process.env.DB_PASSWORD || 'postgres';
  const database = process.env.DB_NAME || 'automation_db';

  await ensurePostgresDatabase({ host, port, user: username, password, database });

  return {
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    entities: [Pipeline, Job, Task],
    synchronize: true,
  };
}
