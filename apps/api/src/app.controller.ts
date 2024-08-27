import { Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';

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

  @Post('users')
  async createUser() {
    const response = await lastValueFrom(
      this.authService.send({ cmd: 'create-user' }, {})
    );
    return response;
  }

  @Post('auth/register')
  async register() {
    const response = await lastValueFrom(
      this.authService.send({ cmd: 'register' }, {})
    );
    return response;
  }

  @Get('presence')
  async getPresence() {
    return this.presenceService.send({ cmd: 'get-presence' }, {});
  }
}
