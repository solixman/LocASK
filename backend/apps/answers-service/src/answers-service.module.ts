import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { User } from './entities/user.entity';
import { AnswersServiceController } from './answers-service.controller';
import { AnswersServiceService } from './answers-service.service';
import { UsersService } from './users.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123123',
      database: 'LocAsk_answers',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Answer, User]),
  ],
  controllers: [AnswersServiceController],
  providers: [AnswersServiceService, UsersService],
})
export class AnswersServiceModule {}