import { Injectable } from "@nestjs/common";
import { TypeORMAbstractRepository } from "./typeorm-base/typeorm-abstract.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FriendRequestEntity } from "../entities/friend-request.entity";
import { FriendRequestsRepositoryInterface } from "../interfaces/friend-requests-repository.interface";
import { ConversationEntity } from "../entities/conversation.entity";
import { ConversationsRepositoryInterface } from "../interfaces/conversations-repository.interface";

@Injectable()
export class ConversationsRepository extends TypeORMAbstractRepository<ConversationEntity> implements ConversationsRepositoryInterface {
    constructor(
        @InjectRepository(ConversationEntity)
        private readonly conversationsRepository: Repository<ConversationEntity>
    ) {
        super(conversationsRepository);
    }

    
    public async findConversationTwoUsers(userId: number, friendId: number): Promise<ConversationEntity | undefined> {
        return await this.conversationsRepository
            .createQueryBuilder('conversation')
            .leftJoin('conversation.users', 'user')
            .where('user.id = :userId', {userId})
            .orWhere('user.id = :friendId', {friendId})
            .groupBy('conversation.id')
            .having('COUNT(*) > 1')
            .getOne();
    }
}