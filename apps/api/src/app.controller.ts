import { AuthGuard, CreateUserDto, LoginUserDto, User, UserInterceptor} from '@app/common';
import { UserRequestDto } from '@app/common/dtos/user-request.dto';
import { BadRequestException, Body, Controller, Get, Inject, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE') 
    private readonly authService:ClientProxy,
    @Inject('PRESENCE_SERVICE')
    private readonly presenceService:ClientProxy
  ) {}

  @Get('users')
  async getUsers() {
    const response = await lastValueFrom(
      this.authService.send({ cmd: 'get-users' }, {})
    );
    return response;
  }

  @Post('auth/register')
  async register(@Body() createUserDto: CreateUserDto) {
    const response = await lastValueFrom(
      this.authService.send({ cmd: 'register' }, {...createUserDto})
    );
  return response;
  }

  @Post('auth/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const response = await lastValueFrom(
      this.authService.send({ cmd: 'login' }, {...loginUserDto})
    );
    return response;
  }

  @Get('presence')
  @UseGuards(AuthGuard)
  async getPresence() {
    return this.presenceService.send({ cmd: 'get-presence' }, {});
  }

  @Get('add-friend/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  async addFriend(@User() user: UserRequestDto, @Param('id') friendId:number) {
    if(!user) {
      throw new BadRequestException();
    }

    return this.authService.send(
      { cmd: 'add-friend' }, 
      {
        userId: user.id,
        friendId
      }
    );
  }


  @Get('get-user/:id')
  async getFriend(@Param('id') id:number) {

    return this.authService.send(
      { cmd: 'get-user' }, 
      {
        id
      }
    );
  }

  @Get('get-friends')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  async getFriends(@User() user: UserRequestDto) {
    if(!user) {
      throw new BadRequestException();
    }

    return this.authService.send(
      { cmd: 'get-friends' }, 
      {
        userId: user.id
      }
    );
  }
}
