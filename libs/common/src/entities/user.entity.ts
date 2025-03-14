import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable, ManyToMany } from 'typeorm';
import { FriendRequestEntity } from './friend-request.entity';
import { ConversationEntity } from './conversation.entity';
import { MessageEntity } from './message.entity';
import { measureMemory } from 'vm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName:string;

  @Column()
  lastName: string;

  @Column({select: false})
  hashedPassword:string;

  @Column({ unique: true })
  email:string;

  @OneToMany(() => FriendRequestEntity, (friendRequest) => friendRequest.creator)
  friendRequestCreator: FriendRequestEntity[];

  @OneToMany(() => FriendRequestEntity, (friendRequest) => friendRequest.receiver)
  friendRequestReceiver: FriendRequestEntity[];

  @ManyToMany(() => ConversationEntity, (conversation) => conversation.users)
  conversations: ConversationEntity[];

  @OneToMany(() => MessageEntity, (message) => message.user)
  messages: MessageEntity[];
}