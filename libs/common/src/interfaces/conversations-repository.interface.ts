
import { ConversationEntity } from '../entities/conversation.entity';
import { TypeORMBaseInterface } from '../repositories/typeorm-base/typeorm-repository.interface';

export interface ConversationsRepositoryInterface
  extends TypeORMBaseInterface<ConversationEntity> {
    findConversationTwoUsers(userId: number, friendId: number): Promise<ConversationEntity | undefined>;
}