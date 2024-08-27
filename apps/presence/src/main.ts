import { NestFactory } from '@nestjs/core';
import { PresenceModule } from './presence.module';
import { CommonService } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(PresenceModule);
  const configService = app.get(ConfigService);
  const commonService = app.get(CommonService);
  const queue = configService.get('RABBITMQ_PRESENCE_QUEUE');

  app.connectMicroservice<MicroserviceOptions>(commonService.getRmqOptions(queue))
  await app.startAllMicroservices();
  await app.listen(6000);
}
bootstrap();
