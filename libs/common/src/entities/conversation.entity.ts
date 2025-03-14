import { Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { MessageEntity } from "./message.entity";

@Entity('conversations')
export class ConversationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => UserEntity, (user) => user.conversations)
    @JoinTable()
    users: UserEntity[];

    @UpdateDateColumn()
    lastUpdated: Date;

    @OneToMany(() => MessageEntity, (message) => message.conversation, {eager: true})
    messages: MessageEntity[];
}