import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Post } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

interface CreateAnswerDto {
  content: string;
  userId: string;
  questionId: string;
}

@Controller('answers')
export class AnswersController {
  private answersServiceUrl = 'http://localhost:3005';
  private logger = new Logger('AnswersController');

  constructor(private readonly httpService: HttpService) {}

  @Post()
  async createAnswer(@Body() data: CreateAnswerDto) {
    try {
      const result = await this.httpService.post(
        `${this.answersServiceUrl}/answers`,
        data,
        { timeout: 30000 },
      ).toPromise();
      return result?.data;
    } catch (error) {
      const err = error as any;
      this.logger.error('Error creating answer:', err?.message ?? err);

      if (err?.code === 'ECONNREFUSED') {
        throw new HttpException('Answers service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
      }

      if (err?.response?.status) {
        throw new HttpException(err.response.data || 'Unable to create answer', err.response.status);
      }

      throw new HttpException('Unable to create answer', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('question/:questionId')
  async getAnswersByQuestion(@Param('questionId') questionId: string) {
    try {
      const result = await this.httpService.get(
        `${this.answersServiceUrl}/answers/question/${questionId}`,
        { timeout: 30000 },
      ).toPromise();
      return result?.data;
    } catch (error) {
      const err = error as any;
      this.logger.error('Error getting answers:', err?.message ?? err);

      if (err?.code === 'ECONNREFUSED') {
        throw new HttpException('Answers service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
      }

      if (err?.response?.status) {
        throw new HttpException(err.response.data || 'Unable to fetch answers', err.response.status);
      }

      throw new HttpException('Unable to fetch answers', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('test')
  async test() {
    return this.httpService.get(`${this.answersServiceUrl}/answers/test`, { timeout: 30000 }).toPromise().then(res => res?.data);
  }
}
