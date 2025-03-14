import { Injectable } from "@nestjs/common";
import { TypeORMAbstractRepository } from "./typeorm-base/typeorm-abstract.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FriendRequestEntity } from "../entities/friend-request.entity";
import { FriendRequestsRepositoryInterface } from "../interfaces/friend-requests-repository.interface";

@Injectable()
export class FriendRequestsRepository extends TypeORMAbstractRepository<FriendRequestEntity> implements FriendRequestsRepositoryInterface {
    constructor(
        @InjectRepository(FriendRequestEntity)
        private readonly friendRequestsRepository: Repository<FriendRequestEntity>
    ) {
        super(friendRequestsRepository);
    }
}