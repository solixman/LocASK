import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Post, Query } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateQuestionDto, GetQuestionsDto, ToggleLikeDto } from './dto/questions.dto';

@Controller('questions')
export class QuestionsController {
  private questionsServiceUrl = 'http://localhost:3003';
  private logger = new Logger('QuestionsController');

  constructor(private readonly httpService: HttpService) {}

  @Post()
  async createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    try {
      const result = await this.httpService.post(
        `${this.questionsServiceUrl}/questions`,
        createQuestionDto,
        { timeout: 30000 }
      ).toPromise();
      return result?.data;
    } catch (error) {
      this.logger.error('Error creating question:', (error as any)?.message ?? error);
      throw new HttpException('Unable to create question', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async getQuestions(@Query() query: GetQuestionsDto) {
    try {
      const result = await this.httpService.get(
        `${this.questionsServiceUrl}/questions`,
        { params: { userLat: query.latitude, userLng: query.longitude }, timeout: 30000 }
      ).toPromise();
      return result?.data;
    } catch (error) {
      this.logger.error('Error getting questions:', (error as any)?.message ?? error);
      throw new HttpException('Unable to fetch questions', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('liked/:userId')
  async getLikedQuestionsByUser(@Param('userId') userId: string) {
    try {
      const result = await this.httpService.get(
        `${this.questionsServiceUrl}/questions/liked/${userId}`,
        { timeout: 30000 }
      ).toPromise();
      return result?.data;
    } catch (error) {
      const err = error as any;
      this.logger.error('Error getting liked questions by user:', err?.message ?? err);

      if (err?.code === 'ECONNREFUSED') {
        throw new HttpException('Questions service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
      }

      if (err?.response?.status) {
        throw new HttpException(err.response.data || 'Unable to get liked questions', err.response.status);
      }

      throw new HttpException('Unable to get liked questions', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post(':id/like')
  async toggleLike(@Param('id') questionId: string, @Body() body: ToggleLikeDto) {
    try {
      const result = await this.httpService.post(
        `${this.questionsServiceUrl}/questions/like`,
        { questionId, userId: body.userId }
      ).toPromise();
      return result?.data;
    } catch (error) {
      const err = error as any;
      this.logger.error('Error toggling like:', err?.message ?? err);

      if (err?.code === 'ECONNREFUSED') {
        throw new HttpException('Questions service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
      }

      if (err?.response?.status) {
        throw new HttpException(err.response.data || 'Unable to toggle like', err.response.status);
      }

      throw new HttpException('Unable to toggle like', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('test')
  async test() {
    return { message: 'Questions service test endpoint' };
  }
}
