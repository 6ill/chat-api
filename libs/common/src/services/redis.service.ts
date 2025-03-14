import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache 
    ) {}

    async get(key:string) {
        return this.cacheManager.get(key);
    }
    async set(key: string, value: unknown, ttl = 0) {
        await this.cacheManager.set(key, value, ttl);
      }
    
    async del(key: string) {
        await this.cacheManager.del(key);
    }

    async reset() {
        await this.cacheManager.reset();
    }
}
