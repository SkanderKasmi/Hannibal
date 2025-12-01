import { ClientsModule, Transport } from '@nestjs/microservices';

export const RmqClientModule = ClientsModule.register([
  {
    name: 'AGENT_SERVICE',
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URL || 'amqp://guest:guest@rabbitmq:5672'],
      queue: 'agent_queue',
      queueOptions: { durable: true },
    },
  },
]);
