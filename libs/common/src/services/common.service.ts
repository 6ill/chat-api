import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class CommonService {
    constructor(
        private readonly configService:ConfigService
    ) {}

    getRmqOptions(queue: string): RmqOptions {
        const USER = this.configService.get<string>('RABBITMQ_USER');
        const PASSWORD = this.configService.get<string>('RABBITMQ_PASS');
        const HOST = this.configService.get<string>('RABBITMQ_HOST');

        return {
            transport: Transport.RMQ,
            options: {
              urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
              noAck: false,
              queue,
              queueOptions: {
                durable: true
              },
            },
        }
    }

    acknowledgeMsg(context: RmqContext): void {
        const channel = context.getChannelRef();
        const msg = context.getMessage();
        channel.ack(msg);
    }
}
