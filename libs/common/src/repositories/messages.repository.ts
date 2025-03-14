import { Injectable } from "@nestjs/common";
import { TypeORMAbstractRepository } from "./typeorm-base/typeorm-abstract.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MessageEntity } from "../entities/message.entity";
import { MessagesRepositoryInterface } from "../interfaces/messages-repository.interface";

@Injectable()
export class MessagesRepository extends TypeORMAbstractRepository<MessageEntity> implements MessagesRepositoryInterface {
    constructor(
        @InjectRepository(MessageEntity)
        private readonly messagesRepository: Repository<MessageEntity>
    ) {
        super(messagesRepository);
    }
}