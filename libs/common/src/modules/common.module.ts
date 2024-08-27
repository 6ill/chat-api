import { DynamicModule, Module } from '@nestjs/common';
import { CommonService } from '../services/common.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AuthGuard } from '../guards/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env'
    })
  ],
  providers: [CommonService, AuthGuard],
  exports: [CommonService, AuthGuard],
})
export class CommonModule {
  static registerRmq(service: string, queue:string): DynamicModule {
    const providers = [
      {
        provide: service,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const USER = configService.get<string>('RABBITMQ_USER');
          const PASSWORD = configService.get<string>('RABBITMQ_PASS');
          const HOST = configService.get<string>('RABBITMQ_HOST');
          return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
              urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
              queue,
              queueOptions: {
                durable: true
              },
            },
          })
        },
      }
    ]
    return {
      module: CommonModule, 
      providers,
      exports: providers
    }
  }
}
