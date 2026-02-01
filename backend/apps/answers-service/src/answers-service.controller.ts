import { Controller, Get } from '@nestjs/common';
import { AnswersServiceService } from './answers-service.service';
import { MessagePattern } from '@nestjs/microservices';
import { AnswerDto } from './dto/answers.dto';

@Controller()
export class AnswersServiceController {
  constructor(private readonly answersServiceService: AnswersServiceService) { }

  @MessagePattern('test')
  getHello(): string {
    return this.answersServiceService.getHello();
  }

  @MessagePattern('create_answer')
  createAnswer(data: AnswerDto) {
    console.log('Received create answer datain the answers service controller', data);
    return this.answersServiceService.createAnswer(data);
  }

  @MessagePattern('get_answers')
  getAnswers(data: { questionId: string }) {
    console.log('Received get answers datain the answers service controller', data);
    return this.answersServiceService.getAnswers({ questionId: data.questionId });
  }
}
