import { Module } from '@nestjs/common';
import { PresenceController } from './presence.controller';
import { PresenceService } from './presence.service';
import { CommonModule } from '@app/common';

@Module({
  imports: [
    CommonModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE)
  ],
  controllers: [PresenceController],
  providers: [PresenceService],
})
export class PresenceModule {}
