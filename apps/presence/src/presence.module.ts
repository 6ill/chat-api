import { Module } from '@nestjs/common';
import { PresenceController } from './presence.controller';
import { PresenceService } from './presence.service';
import { CommonModule, RedisModule } from '@app/common';
import { PresenceGateway } from './presence.gateway';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CommonModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    CacheModule.register(),
    RedisModule
  ],
  controllers: [PresenceController],
  providers: [PresenceService, PresenceGateway],
})
export class PresenceModule {}
