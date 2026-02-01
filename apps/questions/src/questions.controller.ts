import { Controller, Get } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @MessagePattern('test')
  getHello(): string {
    return this.questionsService.getHello();
  }
}
