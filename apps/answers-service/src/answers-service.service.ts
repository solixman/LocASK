import { Inject, Injectable } from '@nestjs/common';
import { AnswerDto } from './dto/answers.dto';
import { prisma } from '../lib/prisma';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AnswersServiceService {
  constructor(@Inject('QUESTIONS_SERVICE') private readonly questionsService: ClientProxy) { }

  getHello(): string {
    return 'Hello World!';
  }

  async createAnswer(data: AnswerDto) {
    if (!data.content || !data.userId || !data.questionId) {
      return { message: 'Missing required fields: content, userId, or questionId' };
    }
    
    try {
      const res = await firstValueFrom(
        this.questionsService.send('check_question', { questionId: data.questionId }),
      );
      console.log('Received response from the questions service:', res);
      console.log('Received response from the questions service:', data);

      if (res) {
        return prisma.answer.create({
          data: {
            content: data.content,
            userId: data.userId,
            questionId: data.questionId,
          },
        });
      }
      return { message: 'Question not found' };
    } catch (error) {
      console.error('Error checking question existence:', error);
      return { message: 'Error verifying question existence' };
    }
  }
}
