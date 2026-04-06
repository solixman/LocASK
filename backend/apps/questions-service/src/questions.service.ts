import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { AuthUserClient } from './auth-user.client';
import { CreateQuestionDto, LikeQuestionDto } from './dto/questions.dto';
import { Like } from './entities/like.entity';
import { Question } from './entities/question.entity';
import { User } from './entities/user.entity';

type QuestionWithLikesCount = Question & {
  likesCount: number;
};

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @Inject('ANSWERS_SERVICE')
    private readonly answersClient: ClientProxy,
    private readonly authUserClient: AuthUserClient,
  ) {}

  async createQuestion(createQuestionDto: CreateQuestionDto) {
    const user = await this.upsertUserFromAuth(createQuestionDto.userId);
    const question = this.questionsRepository.create(createQuestionDto);
    if (user) {
      question.user = user;
    }
    const savedQuestion = await this.questionsRepository.save(question);

    return this.enrichQuestion(savedQuestion, 0);
  }

  async getAllQuestions(userLat?: number, userLng?: number) {
    const questions = await this.questionsRepository
      .createQueryBuilder('question')
      .loadRelationCountAndMap('question.likesCount', 'question.likes')
      .getMany();

    let mappedQuestions = await this.enrichQuestions(
      questions.map((question) => ({
        ...question,
        likesCount: Number((question as Question & { likesCount?: number }).likesCount ?? 0),
      })),
    );

    if (typeof userLat === 'number' && typeof userLng === 'number') {
      mappedQuestions = mappedQuestions
        .map((question) => ({
          ...question,
          distance: this.calculateDistance(
            userLat,
            userLng,
            question.latitude,
            question.longitude,
          ),
        }))
        .sort((a, b) => a.distance - b.distance);
    }

    return mappedQuestions;
  }

  async getQuestionById(id: string) {
    const question = await this.questionsRepository
      .createQueryBuilder('question')
      .where('question.id = :id', { id })
      .loadRelationCountAndMap('question.likesCount', 'question.likes')
      .getOne();

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const enrichedQuestion = await this.enrichQuestion(
      question,
      Number((question as Question & { likesCount?: number }).likesCount ?? 0),
    );

    try {
      const answers = await firstValueFrom(
        this.answersClient.send({ cmd: 'get_answers_by_question' }, { questionId: id }),
      );

      return {
        ...enrichedQuestion,
        answers,
      };
    } catch {
      return {
        ...enrichedQuestion,
        answers: [],
      };
    }
  }

  async likeQuestion(likeQuestionDto: LikeQuestionDto) {
    const question = await this.questionsRepository.findOne({
      where: { id: likeQuestionDto.questionId },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const existingLike = await this.likesRepository.findOne({
      where: {
        questionId: likeQuestionDto.questionId,
        userId: likeQuestionDto.userId,
      },
    });

    if (existingLike) {
      await this.likesRepository.delete({ id: existingLike.id });

      const likesCountAfterUnlike = await this.likesRepository.count({
        where: { questionId: likeQuestionDto.questionId },
      });

      return {
        ...(await this.enrichQuestion(question, likesCountAfterUnlike)),
        isLiked: false,
      };
    }

    await this.likesRepository.save(
      this.likesRepository.create({
        questionId: likeQuestionDto.questionId,
        userId: likeQuestionDto.userId,
      }),
    );

    const likesCount = await this.likesRepository.count({
      where: { questionId: likeQuestionDto.questionId },
    });

    return {
      ...(await this.enrichQuestion(question, likesCount)),
      isLiked: true,
    };
  }

  async getUserById(id: string) {
    const users = await this.authUserClient.getUsersByIds([id]);
    return users[id] ?? null;
  }

  async getLikedQuestionsByUser(userId: string) {
    const likes = await this.likesRepository.find({
      where: { userId },
      relations: ['question'],
    });

    const likedQuestions = likes
      .map((like) => like.question)
      .filter((question): question is Question => Boolean(question));

    return Promise.all(
      likedQuestions.map(async (question) => {
        const likesCount = await this.likesRepository.count({
          where: { questionId: question.id },
        });

        return this.enrichQuestion(question, likesCount);
      }),
    );
  }

  private async enrichQuestions(questions: QuestionWithLikesCount[]) {
    const userIds = questions
      .map((question) => question.userId)
      .filter((id): id is string => Boolean(id));
    const users = await this.authUserClient.getUsersByIds(userIds);

    return questions.map((question) => this.mapQuestionResponse(question, question.likesCount, users));
  }

  private async enrichQuestion(question: Question, likesCount: number) {
    const userIds = question.userId ? [question.userId] : [];
    const users = await this.authUserClient.getUsersByIds(userIds);
    return this.mapQuestionResponse(question, likesCount, users);
  }

  private mapQuestionResponse(
    question: Question,
    likesCount: number,
    users: Record<string, { id: string; name: string | null; picture: string | null }>,
  ) {
    const user = question.userId ? users[question.userId] ?? null : null;

    return {
      id: question.id,
      title: question.title,
      content: question.content,
      latitude: question.latitude,
      longitude: question.longitude,
      userId: question.userId,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      likesCount,
      user,
    };
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const earthRadiusKm = 6371;
    const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const deltaLat = degreesToRadians(lat2 - lat1);
    const deltaLon = degreesToRadians(lon2 - lon1);

    const haversineValue =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(degreesToRadians(lat1)) *
        Math.cos(degreesToRadians(lat2)) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);

    const angularDistance =
      2 * Math.atan2(Math.sqrt(haversineValue), Math.sqrt(1 - haversineValue));

    return earthRadiusKm * angularDistance;
  }

  private async upsertUserFromAuth(userId: string) {
    if (!userId) {
      return null;
    }

    let stored = await this.usersRepository.findOne({ where: { id: userId } });
    if (stored) {
      return stored;
    }

    const usersMap = await this.authUserClient.getUsersByIds([userId]);
    const authUser = usersMap[userId];
    if (!authUser) {
      return null;
    }

    const user = this.usersRepository.create({
      id: authUser.id,
      name: authUser.name,
      picture: authUser.picture,
      email: undefined,
    });

    stored = await this.usersRepository.save(user);
    return stored;
  }
}