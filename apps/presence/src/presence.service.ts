import { Injectable } from '@nestjs/common';

@Injectable()
export class PresenceService {
  getFoo() {
    return { foo: 'cat' }
  }
}
