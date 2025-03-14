
import { MessageEntity } from '../entities/message.entity';
import { TypeORMBaseInterface } from '../repositories/typeorm-base/typeorm-repository.interface';

export interface MessagesRepositoryInterface
  extends TypeORMBaseInterface<MessageEntity> {}