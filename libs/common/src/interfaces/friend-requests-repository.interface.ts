
import { FriendRequestEntity } from '../entities/friend-request.entity';
import { TypeORMBaseInterface } from '../repositories/typeorm-base/typeorm-repository.interface';

export interface FriendRequestsRepositoryInterface
  extends TypeORMBaseInterface<FriendRequestEntity> {}