import { RedisService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ActiveUser } from './interfaces/active-user.interface';

@Injectable()
export class PresenceService {
  constructor(
    private redisService: RedisService
  ) {}

  async getFoo() {
    const foo = await this.redisService.get('foo');

    if(foo) {
      console.log('CACHED')
      return foo
    }
    console.log('NOT CACHED');
    const f = {foo: 'cat'};
    this.redisService.set('foo', f);
    return f;
  }

  async getActiveUser(id: number):Promise<ActiveUser | undefined> {
    const user = await this.redisService.get(`user ${id}`);
    return user as ActiveUser | undefined;
  }
}
