import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateAnswerDto } from './dto/answers.dto';
import { AnswersServiceService } from './answers-service.service';

@Controller()
export class AnswersServiceController {
  constructor(private readonly answersServiceService: AnswersServiceService) {}

  @MessagePattern({ cmd: 'create_answer' })
  createAnswer(@Payload() createAnswerDto: CreateAnswerDto) {
    return this.answersServiceService.createAnswer(createAnswerDto);
  }

  @MessagePattern({ cmd: 'get_answers_by_question' })
  getAnswersByQuestion(@Payload() questionId: string) {
    return this.answersServiceService.getAnswersByQuestion(questionId);
  }

  @Post('answers')
  createAnswerHttp(@Body() createAnswerDto: CreateAnswerDto) {
    return this.answersServiceService.createAnswer(createAnswerDto);
  }

  @Get('answers/question/:questionId')
  getAnswersHttp(@Param('questionId') questionId: string) {
    return this.answersServiceService.getAnswersByQuestion(questionId);
  }

  @Get('answers/test')
  test() {
    return { message: 'Answers service test endpoint' };
  }
}