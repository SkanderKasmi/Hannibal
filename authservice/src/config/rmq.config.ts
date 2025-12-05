import { RmqOptions, Transport } from '@nestjs/microservices';

export const rmqServerOptions: RmqOptions = {
  transport: Transport.RMQ,
  options: {
    urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672'],
    queue: 'auth-service',
    queueOptions: { durable: true },
  },
};
