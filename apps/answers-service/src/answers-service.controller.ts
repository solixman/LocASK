import { Controller, Get } from '@nestjs/common';
import { AnswersServiceService } from './answers-service.service';

@Controller()
export class AnswersServiceController {
  constructor(private readonly answersServiceService: AnswersServiceService) {}

  @Get()
  getHello(): string {
    return this.answersServiceService.getHello();
  }
}
