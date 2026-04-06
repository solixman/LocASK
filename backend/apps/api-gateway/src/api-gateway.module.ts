import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { AuthController } from './auth/auth.controller';
import { QuestionsController } from './questions/questions.controller';
import { AnswersController } from './answers/answers.controller';

@Module({
  imports: [HttpModule],
  controllers: [ApiGatewayController, AuthController, QuestionsController, AnswersController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
