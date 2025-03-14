import { Controller, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { CommonService, CreateUserDto, LoginUserDto } from '@app/common';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';

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

  @MessagePattern({ cmd: 'get-user' })
  async getUser(@Payload() data: {id: number}, @Ctx() context: RmqContext){
    this.commonService.acknowledgeMsg(context);

    return this.authService.getUserById(data.id);
  }

  @MessagePattern({ cmd: 'register' })
  async register(@Payload() data: CreateUserDto, @Ctx() context: RmqContext) {
    this.commonService.acknowledgeMsg(context);

    return this.authService.register(data);
  }

  @MessagePattern({ cmd: 'login' })
  async login(@Payload() data: LoginUserDto, @Ctx() context: RmqContext) {
    this.commonService.acknowledgeMsg(context);

    return this.authService.login(data);
  }

  @MessagePattern({ cmd: 'verify-jwt' })
  @UseGuards(JwtAuthGuard)
  async verifyJwt(@Payload() data: { jwt: string }, @Ctx() context: RmqContext) {
    this.commonService.acknowledgeMsg(context);

    return this.authService.verifyJwt(data.jwt);
  }

  @MessagePattern({ cmd: 'decode-jwt' })
  async decodeUserJwt(@Payload() data: { jwt: string }, @Ctx() context: RmqContext) {
    this.commonService.acknowledgeMsg(context);

    return this.authService.decodeUserJwt(data.jwt);
  }

  @MessagePattern({ cmd: 'add-friend' })
  async addFriend(@Payload() data: { userId: number, friendId:number }, @Ctx() context: RmqContext) {
    this.commonService.acknowledgeMsg(context);

    return this.authService.addFriend(data.userId, data.friendId);
  }

  @MessagePattern({ cmd: 'get-friends' })
  async getFriends(@Payload() data: { userId: number }, @Ctx() context: RmqContext) {
    this.commonService.acknowledgeMsg(context);

    return this.authService.getFriends(data.userId);
  }

  @MessagePattern({ cmd: 'get-friend-list' })
  async getFriendList(@Payload() data: { userId: number }, @Ctx() context: RmqContext) {
    this.commonService.acknowledgeMsg(context);

    return this.authService.getFriendList(data.userId);
  }
}
