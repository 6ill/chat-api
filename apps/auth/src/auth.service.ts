import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) 
    private readonly usersRepository: Repository<UserEntity>
  ){}
  
  async getUsers(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  async createUser(): Promise<UserEntity> {
    return this.usersRepository.save({firstName: "Alibi", lastName:"Moses"});
  }
}
