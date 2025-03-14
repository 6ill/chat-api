import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { ConversationEntity } from "./conversation.entity";

@Entity('messages')
export class MessageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @ManyToOne(() => UserEntity)
    user: UserEntity;

    @ManyToOne(() => ConversationEntity)
    conversation: ConversationEntity;

    @CreateDateColumn()
    createdAt: Date;
}