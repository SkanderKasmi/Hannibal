import { Transport, RmqOptions, ClientOptions } from '@nestjs/microservices';

export const rmqServerOptions: RmqOptions = {
  transport: Transport.RMQ,
  options: {
    urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672'],
    queue: 'report-service',
    queueOptions: { durable: true },
  },
};

// Client used to call MonitorService (metrics.snapshotForReport)
export const monitorClientOptions: ClientOptions = {
  transport: Transport.RMQ,
  options: {
    urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672'],
    queue: 'monitor-service',
    queueOptions: { durable: true },
  },
};
