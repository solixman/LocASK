import { Controller } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateQuestionDto, GetQuestionsDto, ToggleLikeDto } from './dto/questions.dto';

@Controller()
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @MessagePattern('create_question')
  createQuestion(@Payload() data: CreateQuestionDto) {
    return this.questionsService.createQuestion(data);
  }

  @MessagePattern('get_questions')
  getQuestions(@Payload() data: GetQuestionsDto) {
    return this.questionsService.getQuestions(data);
  }

  @MessagePattern('get_liked_questions')
  getLikedQuestions(@Payload() data: GetQuestionsDto) {
    return this.questionsService.getLikedQuestions(data);
  }

  @MessagePattern('toggle_like')
  toggleLike(@Payload() data: ToggleLikeDto) {
    return this.questionsService.toggleLike(data);
  }
}
