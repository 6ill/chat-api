import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, FriendRequestEntity, FriendRequestsRepositoryInterface, LoginUserDto, UserEntity, UsersRepositoryInterface } from  '@app/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserJwt } from '@app/common';
import { UserRequestDto } from '@app/common/dtos/user-request.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USERS_REPOSITORY') 
    private readonly usersRepository: UsersRepositoryInterface,
    @Inject('FRIEND_REQUESTS_REPOSITORY')
    private readonly friendRequestsRepository: FriendRequestsRepositoryInterface,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ){}
  
  async getUsers(): Promise<UserEntity[]> {
    return this.usersRepository.findAll(); 
  }

  async getUserById(id: number): Promise<UserEntity> {
    console.log('auth service get user by id');
    return this.usersRepository.findOneById(id);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOneByCondition(
      {
        where: {email},
        select: ['id', 'email', 'hashedPassword', 'firstName', 'lastName']
      }
    );
  }

  async hashPassword(password:string): Promise<string> {
    return bcrypt.hash(password, Number(this.configService.get('HASH_ROUND')));
  }

  async register(newUser: Readonly<CreateUserDto>): Promise<UserEntity> {
    try {
      const { firstName, lastName, email, password } = newUser;
      const existingUser = await this.findByEmail(email);
      if(existingUser) {
        throw new ConflictException('An account with that email is already exist');
      }
      const hashedPassword = await this.hashPassword(password);
  
      const createdUser = this.usersRepository.create({
        firstName,
        lastName,
        email,
        hashedPassword
      });
  
      const savedUser = await this.usersRepository.save(createdUser);
  
      delete savedUser.hashedPassword;
      return savedUser;
    } catch (error) {
      throw error;
    }
  }



  async login(loginData: Readonly<LoginUserDto>): Promise<{token:string, user:UserEntity}> {
    try {
      const { email, password } = loginData;
      const accountExist = await this.findByEmail(email);
  
      if(!accountExist) {
        throw new ConflictException('An account does not exist with that email');
      }
      const isMatch = await bcrypt.compare(password, accountExist.hashedPassword);
  
      if(!isMatch) {
        throw new  ConflictException('Password does not match');
      }
      delete accountExist.hashedPassword; 

      const jwt = await this.jwtService.signAsync({ user: accountExist });
      return {
        token: jwt, user: accountExist
      }
    } catch (error) {
      throw error;
    }
  }

  async verifyJwt(jwtToken: string): Promise<{ user:UserEntity, exp:number }> {
    if(!jwtToken) throw new UnauthorizedException();
    try {
      const {user, exp} = await this.jwtService.verifyAsync(jwtToken);
      return {user, exp};
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async decodeUserJwt(jwtToken: string): Promise<UserJwt> {
    if(!jwtToken) throw new UnauthorizedException();

    try {
      return this.jwtService.decode(jwtToken) as UserJwt;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async addFriend(userId: number, friendId: number) {
    const creator = await this.usersRepository.findOneById(userId);
    const receiver = await this.usersRepository.findOneById(friendId);

    const createdFriendRequest = this.friendRequestsRepository.create({
      creator,
      receiver
    });

    return await this.friendRequestsRepository.save(createdFriendRequest);
  }

  async getFriends(userId: number): Promise<FriendRequestEntity[]> {
    const creator = await this.usersRepository.findOneById(userId);
    
    return await this.friendRequestsRepository.findWithRelations({
        relations: {creator:true, receiver:true},
        where: [
          {creator},
          {receiver:creator}
        ]  
    })
  }

  async getFriendList(userId: number):Promise<UserRequestDto[]> {
    const friendRequests = await this.getFriends(userId);
    if(!friendRequests) return [];
    
    const friends = friendRequests.map((friend) => {
      const isCreator = userId === friend.creator.id;
      const friendDetails = isCreator ? friend.receiver: friend.creator;
      const {id, firstName, lastName, email} = friendDetails;

      return {id, firstName, lastName, email};
    });

    return friends;
  }

}
