import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth/auth.controller';
import { QuestionsController } from './questions/questions.controller';
import { AnswersController } from './answers/answers.controller';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecretkey',
      signOptions: { expiresIn: '1d' },
    }),
    ClientsModule.register([
      {
        name: "AUTH_SERVICE",
        transport: Transport.TCP,
        options: {
          host: "127.0.0.1",
          port: 4001,
        },
      },
      {
        name: "QUESTIONS_SERVICE",
        transport: Transport.TCP,
        options: {
          host: "127.0.0.1",
          port: 4002,
        },
      },
      {
        name: "ANSWERS_SERVICE",
        transport: Transport.TCP,
        options: {
          host: "127.0.0.1",
          port: 4003,
        },
      },
    ])],
  controllers: [ApiGatewayController, AuthController, QuestionsController, AnswersController],
  providers: [ApiGatewayService, JwtStrategy],
})
export class ApiGatewayModule { }
