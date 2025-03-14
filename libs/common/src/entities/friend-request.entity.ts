import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity('friend_requests')
export class FriendRequestEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.friendRequestCreator)
    creator: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.friendRequestReceiver)
    receiver: UserEntity;
}