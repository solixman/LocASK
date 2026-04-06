import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateQuestionDto, LikeQuestionDto } from './dto/questions.dto';
import { QuestionsService } from './questions.service';

@Controller()
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @MessagePattern({ cmd: 'create_question' })
  createQuestion(@Payload() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.createQuestion(createQuestionDto);
  }

  @MessagePattern({ cmd: 'get_questions' })
  getQuestions(@Payload() data: { userLat?: number; userLng?: number }) {
    return this.questionsService.getAllQuestions(data?.userLat, data?.userLng);
  }

  @MessagePattern({ cmd: 'get_question_by_id' })
  getQuestionById(@Payload() id: string) {
    return this.questionsService.getQuestionById(id);
  }

  @MessagePattern({ cmd: 'like_question' })
  likeQuestion(@Payload() likeQuestionDto: LikeQuestionDto) {
    return this.questionsService.likeQuestion(likeQuestionDto);
  }

  @Post('questions')
  createQuestionHttp(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.createQuestion(createQuestionDto);
  }

  @Get('questions')
  getQuestionsHttp(
    @Query('userLat') userLat?: string,
    @Query('userLng') userLng?: string,
  ) {
    return this.questionsService.getAllQuestions(
      userLat !== undefined ? Number(userLat) : undefined,
      userLng !== undefined ? Number(userLng) : undefined,
    );
  }

  @Get('questions/:id')
  getQuestionByIdHttp(@Param('id') id: string) {
    return this.questionsService.getQuestionById(id);
  }

  @Get('users/:id')
  getUserById(@Param('id') id: string) {
    return this.questionsService.getUserById(id);
  }

  @Post('questions/like')
  likeQuestionHttp(@Body() likeQuestionDto: LikeQuestionDto) {
    return this.questionsService.likeQuestion(likeQuestionDto);
  }

  @Get('questions/liked/:userId')
  getLikedQuestionsHttp(@Param('userId') userId: string) {
    return this.questionsService.getLikedQuestionsByUser(userId);
  }
}