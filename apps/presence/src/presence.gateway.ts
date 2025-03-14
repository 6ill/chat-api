import { RedisService, UserJwt, UserRequest } from '@app/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { ActiveUser } from './interfaces/active-user.interface';
import { UserRequestDto } from '@app/common/dtos/user-request.dto';

@WebSocketGateway({cors:true})
export class PresenceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject('AUTH_SERVICE') private authService: ClientProxy,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @WebSocketServer()
  server: Server;

  // NOTE: Remove in production
  async onModuleInit() {
    this.cacheManager.reset();
  }

  async handleConnection(socket: Socket): Promise<void> {
    const jwt = socket.handshake.headers.authorization ?? null;

    if(!jwt){
      await this.handleDisconnect(socket);
      return;
    }

    const res = await firstValueFrom(
      this.authService.send<UserJwt>({cmd: 'decode-jwt'}, {jwt})
    ).catch((err) => {
      console.log(err);
    });

    if(!res || !res?.user) {
      await this.handleDisconnect(socket);
      return;
    }

    const { user } = res;
    socket.data.user = user;

    await this.setActiveStatus(socket, true);
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    console.log("HANDLE DISCONNECT");

    await this.setActiveStatus(socket, false);
  }

  private async setActiveStatus(socket: Socket, isActive: boolean): Promise<void> {
    const user:UserRequestDto = socket.data?.user;

    if(!user) return;

    const activeUser:ActiveUser = {
      id: user.id,
      socketId: socket.id,
      isActive
    };

    await this.cacheManager.set(`user ${user.id}`, activeUser, 0);
    await this.emitStatusToFriends(activeUser);
  }

  private async getFriends(userId: number){
    const res = await firstValueFrom<UserRequestDto[]>(
      this.authService.send({ cmd: 'get-friend-list' }, {userId})
    ).catch(
      (err) => console.error(err)
    )

    return res;
  }

  private async emitStatusToFriends(activeUser: ActiveUser): Promise<void> {
    const friends = (await this.getFriends(activeUser.id)) as UserRequestDto[];
    for(const f of friends) {
      const user = await this.cacheManager.get(`user ${f.id}`);

      if(!user) continue;

      const friend = user as ActiveUser;
      // tell friends whether the user is active
      this.server.to(friend.socketId).emit("friendActive", {
        id: activeUser.id,
        isActive: activeUser.isActive
      });
      // if the user is active then tell him/her about the friends status
      if(activeUser.isActive) {
        this.server.to(activeUser.socketId).emit("friendActive", {
          id: friend.id,
          isActive: friend.isActive
        })
      }
    }
  }

  @SubscribeMessage('updateActiveStatus')
  async updateActiveStatus(socket: Socket, isActive: boolean) {
    if (!socket.data?.user) return; 

    await this.setActiveStatus(socket, isActive);
  }
}
