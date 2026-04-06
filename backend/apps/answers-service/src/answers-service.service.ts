import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAnswerDto } from './dto/answers.dto';
import { Answer } from './entities/answer.entity';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Injectable()
export class AnswersServiceService {
  private questionsServiceUrl = 'http://localhost:3003';

  constructor(
    @InjectRepository(Answer)
    private readonly answersRepository: Repository<Answer>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
  ) {}

  private async upsertUserFromAuth(userId: string) {
    let stored = await this.usersRepository.findOne({ where: { id: userId } });
    if (stored) {
      return stored;
    }

    const authUser = await this.usersService.getUserById(userId);
    if (!authUser) {
      return null;
    }

    const user = this.usersRepository.create({
      id: authUser.id,
      name: authUser.name,
      picture: authUser.picture,
      email: undefined,
    });

    return this.usersRepository.save(user);
  }

  async createAnswer(createAnswerDto: CreateAnswerDto) {
    // Validate question exists by calling questions service
    try {
      await this.httpService.get(`${this.questionsServiceUrl}/questions/${createAnswerDto.questionId}`).toPromise();
    } catch (error) {
      throw new BadRequestException('Question not found');
    }

    const user = await this.upsertUserFromAuth(createAnswerDto.userId);

    const answer = this.answersRepository.create({
      content: createAnswerDto.content,
      userId: createAnswerDto.userId,
      user: user ?? undefined,
      questionId: createAnswerDto.questionId,
    });

    const savedAnswer = await this.answersRepository.save(answer);
    return savedAnswer;
  }

  async getAnswersByQuestion(questionId: string) {
    // Validate question exists
    try {
      await this.httpService.get(`${this.questionsServiceUrl}/questions/${questionId}`).toPromise();
    } catch (error) {
      throw new BadRequestException('Question not found');
    }

    const answers = await this.answersRepository.find({
      where: { questionId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    return answers;
  }
}