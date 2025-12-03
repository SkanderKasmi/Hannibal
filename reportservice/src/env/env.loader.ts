export interface ReportEnv {
  RABBITMQ_URL: string;
  MEGA_EMAIL?: string;
  MEGA_PASSWORD?: string;
}

export function loadEnv(): ReportEnv {
  return {
    RABBITMQ_URL:
      process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672',
    MEGA_EMAIL: process.env.MEGA_EMAIL,
    MEGA_PASSWORD: process.env.MEGA_PASSWORD,
  };
}
