import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { CommonModule, ConversationEntity, ConversationsRepository, FriendRequestEntity, MessageEntity, MessagesRepository, PostgresDBModule, RedisModule, UserEntity, UsersRepository } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    PostgresDBModule,
    CommonModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    CommonModule.registerRmq('PRESENCE_SERVICE', process.env.RABBITMQ_PRESENCE_QUEUE),
    TypeOrmModule.forFeature([UserEntity, FriendRequestEntity, ConversationEntity, MessageEntity]),
    RedisModule,
  ],
  controllers: [ChatController],
  providers: [
    ChatService, 
    ChatGateway,
    {
      provide:'MESSAGES_REPOSITORY',
      useClass: MessagesRepository
    },
    {
      provide: 'CONVERSATIONS_REPOSITORY',
      useClass: ConversationsRepository
    }, 
    {
      provide: 'USERS_REPOSITORY',
      useClass: UsersRepository
    }
  ],

})
export class ChatModule {}
