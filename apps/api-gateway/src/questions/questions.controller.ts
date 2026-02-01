import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('questions')
export class QuestionsController {

  constructor(@Inject('QUESTIONS_SERVICE')  private questionsClient:ClientProxy){}

  @Get('test')
  test(){
    return this.questionsClient.send('test', {})
  }

}
