import { Controller, Get } from '@nestjs/common';
import { AnswersServiceService } from './answers-service.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AnswersServiceController {
  constructor(private readonly answersServiceService: AnswersServiceService) {}

  @MessagePattern('test')
  getHello(): string {
    return this.answersServiceService.getHello();
  }

  
}
