import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { CommonService } from '@app/common';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly commonService: CommonService
  ) {}

  @MessagePattern({ cmd: 'get-users' })
  async getUsers(@Ctx() context: RmqContext) {
    this.commonService.acknowledgeMsg(context);

    return this.authService.getUsers();
  }

  @MessagePattern({ cmd: 'create-user' })
  async createUser(@Payload() data, @Ctx() context: RmqContext) {
    this.commonService.acknowledgeMsg(context);

    return this.authService.createUser();
  }
}
