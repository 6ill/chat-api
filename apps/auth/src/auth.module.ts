import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule, ConversationEntity, FriendRequestEntity, FriendRequestsRepository, MessageEntity, PostgresDBModule, UserEntity, UsersRepository } from '@app/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    CommonModule,
    PostgresDBModule,
    TypeOrmModule.forFeature([UserEntity, FriendRequestEntity, ConversationEntity, MessageEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '1h'
          }
        }
      }
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAuthGuard,
    JwtStrategy,
    {
      provide:'USERS_REPOSITORY',
      useClass: UsersRepository
    },
    {
      provide: 'FRIEND_REQUESTS_REPOSITORY',
      useClass: FriendRequestsRepository
    }
  ],
})
export class AuthModule {}
