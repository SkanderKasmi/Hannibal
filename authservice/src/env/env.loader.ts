export function EnvLoader() {
  return {
    DB_HOST: process.env.DB_HOST || 'postgres',
    DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
    DB_USER: process.env.DB_USER || 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
    DB_NAME: process.env.DB_NAME || 'auth_db',

    RABBITMQ_URL:
      process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672',

    JWT_ACCESS_SECRET:
      process.env.JWT_ACCESS_SECRET || 'dev_access_secret_change_me',
    JWT_REFRESH_SECRET:
      process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_me',
  };
}
