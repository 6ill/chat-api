import { Controller, Get, UseGuards } from '@nestjs/common';
import { PresenceService } from './presence.service';
import { MessagePattern, Ctx, RmqContext } from '@nestjs/microservices';
import { AuthGuard, CommonService } from '@app/common';

@Controller()
export class PresenceController {
  constructor(
    private readonly presenceService: PresenceService,
    private readonly commonService: CommonService
  ) {}

  @MessagePattern({ cmd: 'get-presence' })
  @UseGuards(AuthGuard)
  async getPresence(@Ctx() context: RmqContext) {
    this.commonService.acknowledgeMsg(context);

    return this.presenceService.getFoo();
  }
}
