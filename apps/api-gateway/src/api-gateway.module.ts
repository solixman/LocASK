import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth/auth.controller';
import { QuestionsController } from './questions/questions.controller';
import { AnswersController } from './answers/answers.controller';

@Module({
  imports: [ClientsModule.register([
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
  controllers: [ApiGatewayController, AuthController,QuestionsController, AnswersController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
