import { Body, Controller, Get, Inject, Param, Post, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateQuestionDto, GetQuestionsDto, ToggleLikeDto } from './dto/questions.dto';

@Controller('questions')
export class QuestionsController {

  constructor(@Inject('QUESTIONS_SERVICE') private questionsClient: ClientProxy) {}

  @Post()
  createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsClient.send('create_question', createQuestionDto);
  }

  @Get()
  getQuestions(@Query() query: GetQuestionsDto) {
    const payload = {
      latitude: query.latitude ,
      longitude: query.longitude 
    };
    return this.questionsClient.send('get_questions', payload);
  }

  @Post(':id/like')
  toggleLike(@Param('id') questionId: string, @Body() body: ToggleLikeDto) {
    return this.questionsClient.send('toggle_like', {
      questionId,
      userId: body.userId,
    });
  }

  @Get('test')
  test() {
    return this.questionsClient.send('test', {});
  }

}
