import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { PresenceService } from './presence.service';
import { MessagePattern, Ctx, RmqContext, Payload } from '@nestjs/microservices';
import { AuthGuard, CommonService } from '@app/common';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller()
export class PresenceController {
  constructor(
    private readonly presenceService: PresenceService,
    private readonly commonService: CommonService
  ) {}

  @MessagePattern({ cmd: 'get-presence' })
  @UseInterceptors(CacheInterceptor)
  async getPresence(@Ctx() context: RmqContext) {
    this.commonService.acknowledgeMsg(context);

    return this.presenceService.getFoo();
  }

  @MessagePattern({ cmd: 'get-active-user' })
  async getActiveUser(@Payload() data: {id: number}, @Ctx() context: RmqContext){
    this.commonService.acknowledgeMsg(context);

    this.presenceService.getActiveUser(data.id);
  }
}
