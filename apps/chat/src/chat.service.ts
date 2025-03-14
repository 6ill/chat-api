import { ConversationEntity, ConversationsRepositoryInterface, MessagesRepositoryInterface, UserEntity, UsersRepositoryInterface } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NewMessage } from './interfaces/new-message.interface';

@Injectable()
export class ChatService {
  constructor(
    @Inject('MESSAGES_REPOSITORY')
    private readonly messagesRepository: MessagesRepositoryInterface,
    @Inject('CONVERSATIONS_REPOSITORY')
    private readonly conversationsRepository: ConversationsRepositoryInterface,
    @Inject('USERS_REPOSITORY')
    private readonly usersRepository: UsersRepositoryInterface,
    @Inject('AUTH_SERVICE')
    private readonly authService: ClientProxy
  ) {}

  private async getUser(id:number): Promise<UserEntity> {
    const result = await firstValueFrom<UserEntity>(
      this.authService.send(
        { cmd: 'get-user' },
        {id}
      )
    ).catch( err => console.error(err));
    return result as UserEntity;
  }

  async createConversation(userId: number, friendId: number): Promise<ConversationEntity> {
    console.log('ada panggil createConversation')
    const user = await this.getUser(userId);
    const friend = await this.getUser(friendId);
    if(!user || !friend) {
      return null;
    }
    const conversation = await this.conversationsRepository.findConversationTwoUsers(user.id, friend.id);
    if(!conversation) {
      const createdConversation = this.conversationsRepository.create({
        users: [user, friend]
      });
      return await this.conversationsRepository.save(createdConversation);
    }

    return conversation;
  }

  async getConversations(userId: number) {
    const user = await this.usersRepository.findOneByCondition({
      relations: ['conversations', 'conversations.users'],
      where:{id: userId}
    })
    const allUserConversations = user.conversations;
    return allUserConversations.map(conversation => {
      return ({
        id: conversation.id, 
        userIds: (conversation?.users ?? []).map(user => user.id) 
      })
    }
    )
  }
  
  async createMessage(userId: number, newMessage: NewMessage) {
    const user = await this.getUser(userId);

    if (!user) return;

    const conversation = await this.conversationsRepository.findOneByCondition({
      where: [{ id: newMessage.conversationId }],
      relations: {users: true},
    });

    if (!conversation) return;

    const createdMessage = this.messagesRepository.create({
      message: newMessage.message,
      user,
      conversation
    });

    return await this.messagesRepository.save(createdMessage);
  }
}
