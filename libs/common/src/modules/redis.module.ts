import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisService } from '../services/redis.service';

@Module({
    imports: [
        CacheModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                store: await redisStore({
                    url: configService.get('REDIS_URI'),
                    ttl:5000
                })
            }),
            isGlobal: true
        })
    ],
    providers: [RedisService],
    exports: [RedisService]
})
export class RedisModule {}
