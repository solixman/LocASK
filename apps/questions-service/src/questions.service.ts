import { Injectable } from '@nestjs/common';
import { prisma } from '../lib/prisma';
import { CreateQuestionDto, GetQuestionsDto, ToggleLikeDto } from './dto/questions.dto';

@Injectable()
export class QuestionsService {
  async createQuestion(data: CreateQuestionDto) {
    return prisma.question.create({
      data: {
        title: data.title,
        content: data.content,
        latitude: data.latitude,
        longitude: data.longitude,
        userId: data.userId,
      },
    });
  }

  async getQuestions(query: GetQuestionsDto) {
    const questions = await prisma.question.findMany({
      include: {
        likes: true,
      },
    });

    if (query.latitude && query.longitude) {
      return this.sort(questions, { latitude: query.latitude, longitude: query.longitude })
    }
    return questions.map(q => ({ ...q, likesCount: q.likes.length }));
  }

  async getLikedQuestions(query: GetQuestionsDto) {
    const questions = await prisma.question.findMany({
      include: {
        likes: true,
      },
      where: {
        likes: {
          some: {
            userId: query.userId
          }
        }
      }
    });
    if (query.latitude && query.longitude) {
      return this.sort(questions, { latitude: query.latitude, longitude: query.longitude })
    }
    return questions.map(q => ({ ...q, likesCount: q.likes.length }));

  }

  async toggleLike(data: ToggleLikeDto) {
    const existingLike = await prisma.like.findFirst({
      where: {
        questionId: data.questionId,
        userId: data.userId,
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      return { liked: false };
    } else {
      await prisma.like.create({
        data: {
          questionId: data.questionId,
          userId: data.userId,
        },
      });
      return { liked: true };
    }
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
      Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(value: number): number {
    return (value * Math.PI) / 180;
  }

  private sort(questions, loc) {
    return questions.map((q) => ({
      ...q,
      distance: this.calculateDistance(
        Number(loc.latitude),
        Number(loc.longitude),
        q.latitude,
        q.longitude,
      ),
      likesCount: q.likes.length,
    }))
      .sort((a, b) => a.distance - b.distance);
  }

  async checkQuestion(data: { questionId: string }) {
    console.log('Received check question data:', data);
    if (!data || !data.questionId) {
      return false;
    }
    const question = await prisma.question.findUnique({
      where: { id: data.questionId },
    });
    return question !== null;
  }
}