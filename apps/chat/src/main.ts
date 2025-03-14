import { NestFactory } from '@nestjs/core';
import { CommonService } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ChatModule } from './chat.module';

async function bootstrap() {
  const app = await NestFactory.create(ChatModule);

  const configService = app.get(ConfigService);
  const commonService = app.get(CommonService);
  const queue = configService.get('RABBITMQ_CHAT_QUEUE');

  app.connectMicroservice<MicroserviceOptions>(commonService.getRmqOptions(queue))
  await app.startAllMicroservices();
  await app.listen(7000);
}
bootstrap();
