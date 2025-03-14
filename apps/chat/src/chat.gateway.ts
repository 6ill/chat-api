import { RedisService, UserJwt } from '@app/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { firstValueFrom } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UserRequestDto } from '@app/common/dtos/user-request.dto';
import { NewMessage } from './interfaces/new-message.interface';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('PRESENCE_SERVICE') private readonly presenceService: ClientProxy,
    private readonly redisService: RedisService,
    private readonly chatService: ChatService
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    console.log("Connection succesful")
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

    await this.setConversationUser(socket);

    await this.createConversations(socket, user.id);

    await this.getConversations(socket);
  }

  async handleDisconnect(socket: Socket)  {
    console.log('SOCKET DISCONNECT')
  }

  async setConversationUser(socket: Socket) {
    const user = socket.data?.user;

    if (!user || !user.id) return;

    const conversationUser = { id: user.id, socketId: socket.id };

    await this.redisService.set(`conversationUser ${user.id}`, conversationUser);
  }

  
  private async createConversations(socket: Socket, userId: number) {
    const friends = await firstValueFrom<UserRequestDto[]>(
      this.authService.send(
        {
          cmd: 'get-friend-list',
        },
        {
          userId,
        },
      )
    ).catch((err) =>
      console.error(err),
    ) as UserRequestDto[];
    
    friends.forEach(async (friend) => {
      await this.chatService.createConversation(userId, friend.id);
    });
  }
  
  private async getFriendDetails(id: number) {  
    const activeFriend = await firstValueFrom(
        this.presenceService.send(
          {
            cmd: 'get-active-user',
          },
          { id },
        )
    ).catch((err) =>
        console.error(err),
    );
    
    if (!activeFriend) return;
    
    const friendsDetails = (await this.redisService.get(
      `conversationUser ${activeFriend.id}`,
    )) as { id: number; socketId: string } | undefined;
    
    return friendsDetails;
  }

  @SubscribeMessage('ping')
  async ping(socket: Socket) {
    console.log('Keep socket connection alive!');
  }

  @SubscribeMessage('getConversations')
  async getConversations(socket: Socket) {
    const { user } = socket.data;

    if (!user) return;

    const conversations = await this.chatService.getConversations(user.id);
    this.server.to(socket.id).emit('getAllConversations', conversations);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(socket: Socket, newMessage: NewMessage) {
    if (!newMessage) return;

    const { user } = socket.data;

    if (!user) return;

    const createdMessage = await this.chatService.createMessage(
      user.id,
      newMessage,
    );

    const friendId = createdMessage.conversation.users.find(
      (u) => u.id !== user.id,
    ).id;

    const friendDetails = await this.getFriendDetails(friendId);

    if (!friendDetails) return;

    const { id, message, user: creator, conversation } = createdMessage;

    this.server.to(friendDetails.socketId).emit('newMessage', {
      id,
      message,
      creatorId: creator.id,
      conversationId: conversation.id,
    });
  }
}
