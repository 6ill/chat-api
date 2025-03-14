import { Injectable } from "@nestjs/common";
import { TypeORMAbstractRepository } from "./typeorm-base/typeorm-abstract.repository";
import { UserEntity } from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersRepositoryInterface } from "../interfaces/users-repository.interface";

@Injectable()
export class UsersRepository extends TypeORMAbstractRepository<UserEntity> implements UsersRepositoryInterface {
    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>
    ) {
        super(usersRepository);
    }
    public async findConversationsByUser(userId: number): Promise<UserEntity | undefined> {
        return await this.usersRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.conversations', 'conversations')
            .where('user.id = :userId', {userId})
            .getOne()
    }
}