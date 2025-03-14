
import { UserEntity } from '../entities/user.entity';
import { TypeORMBaseInterface } from '../repositories/typeorm-base/typeorm-repository.interface';

export interface UsersRepositoryInterface
  extends TypeORMBaseInterface<UserEntity> {
    findConversationsByUser(userId: number): Promise<UserEntity | undefined>;
  }