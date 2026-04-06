import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthUserClient } from './auth-user.client';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { Like } from './entities/like.entity';
import { Question } from './entities/question.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123123',
      database: 'LocAsk_questions',
      entities: [Question, Like, User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Question, Like, User]),
    ClientsModule.register([
      {
        name: 'ANSWERS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.ANSWERS_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.ANSWERS_SERVICE_PORT || '3002', 10),
        },
      },
    ]),
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService, AuthUserClient],
})
export class QuestionsModule {}